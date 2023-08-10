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
    console.log(portCOM, "PortCOM");
    if (port && port.isOpen) {
      port?.close(function (err) {
        if (err) {
          return console.log("Error closing port: ", err.message);
        }
        console.log("Porta Fechou");
      });
    }

    const serialPorts = await SerialPort.list();

    let portCOMAutomatic;
    let portCOMInput;

    serialPorts.forEach((port) => {
      if (port.manufacturer === "wch.cn") {
        portCOMAutomatic = port.path;
      } else {
        portCOMInput = portCOM;
      }
    });

    const detectedOrInsertPortCom = portCOMAutomatic
      ? portCOMAutomatic
      : portCOMInput;

    port = new SerialPort(
      detectedOrInsertPortCom,
      {
        baudRate: 9600,
        dataBits: 7,
        stopBits: 1,
        parity: "none",
        autoOpen: true,
      },
      (err) => {
        if (err) {
          const errorFileNotFound = err?.message
            .toLowerCase()
            .includes("File not found");
          const errorAccessDenied = err?.message
            .toLocaleLowerCase()
            .includes("Access denied");

          if (errorFileNotFound) {
            return event.reply("balance:testConnection:response", {
              success: false,
              message: "Essa porta COM não foi encontrada",
            });
          }
          if (errorAccessDenied) {
            return event.reply("balance:testConnection:response", {
              success: false,
              message:
                "Essa porta COM já está sendo utilizada por outro dispositivo",
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
