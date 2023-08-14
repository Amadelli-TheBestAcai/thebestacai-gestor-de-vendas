import SerialPort from "serialport";
import { ipcMain } from "electron";
import { sleep } from "../helpers/sleep";
import { settingsFactory } from "../factories/settingsFactory";

let port: SerialPort | null = null;

ipcMain.on("balance:connect", async (event) => {
  try {
    const { has_internal_error, response: settings } =
      await settingsFactory.getSettings();

    if (has_internal_error) {
      event.reply("balance:get:response", { error: true });
      return;
    }

    if (!settings?.balance_port) {
      return;
    }

    if (port && port.isOpen) {
      return;
    }

    port = new SerialPort(
      settings?.balance_port,
      {
        baudRate: 9600,
        dataBits: 7,
        stopBits: 1,
        parity: "none",
        autoOpen: true,
      },
      () => {
        port?.on("error", function (err: any) {
          event.reply("balance:get:response", { error: true });
        });
      }
    );
  } catch (err) {
    console.error(err);
  }
});

ipcMain.on("balance:get", async (event) => {
  port?.once("data", async function (data: any) {
    if (!data.toString().match(/\d+/)) {
      return event.reply("balance:get:response", { weight: 0 });
    }
    const result = data.toString().match(/\d+/)[0];
    const resultFormatedToNumber = +result.replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      "$1."
    );
    return event.reply("balance:get:response", {
      weight: resultFormatedToNumber,
    });
  });

  port?.write("SYST:ADDR?\n", function (err: any) {
    err && console.log("err: " + err);
  });
  await sleep(2000);
  return event.reply("balance:get:response", { weight: 0 });
});

ipcMain.on("balance:testConnection", async (event, portCOM) => {
  try {

    if (port && port.isOpen) {
      port?.close(function (err) {
        if (err) {
          console.log("Error closing port: ", err.message);
          return event.reply("balance:testConnection:response", {
            success: false,
            message: `Erro ao tentar desconectar a porta ${port?.path}`,
          });
        }

      });
      return event.reply("balance:testConnection:response", {
        success: false,
        message: `A porta ${port?.path} foi desconectada`,
      });
    }

    port = new SerialPort(
      portCOM,
      {
        baudRate: 9600,
        dataBits: 7,
        stopBits: 1,
        parity: "none",
        autoOpen: true,
      },
      (err) => {
        if (err) {
          const errorFileNotFound = err?.message.toLowerCase().includes("file not found");
          const errorAccessDenied = err?.message.toLowerCase().includes("access denied");
          if (errorFileNotFound) {
            return event.reply("balance:testConnection:response", {
              success: false,
              message: `A porta ${port?.path} não foi encontrada`,
            });
          }
          if (errorAccessDenied) {
            return event.reply("balance:testConnection:response", {
              success: false,
              message:
                `A porta ${port?.path} já está sendo utilizada por outro dispositivo`,
            });
          }
          console.log(err);
          return event.reply("balance:testConnection:response", {
            success: false,
            message: "Falha ao conectar a balança",
            error: err,
          });
        } else {
          port?.on("error", function (err: any) {
            console.log(err);
            return event.reply("balance:testConnection:response", {
              success: false,
              message: "Falha ao conectar a balança",
              error: err,
            });
          });
          return event.reply("balance:testConnection:response", {
            success: true,
            message: "Conexão com a balança foi estabelecida com sucesso",
            error: err,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return event.reply("balance:testConnection:response", {
      success: false,
      message: "Falha ao conectar a balança",
      error,
    });
  }
});
