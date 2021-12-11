import SerialPort from "serialport";
import { ipcMain } from "electron";
import { sleep } from "../helpers/sleep";

let port: SerialPort | null = null;

ipcMain.on("balance:connect", async (event) => {
  try {
    // const settings = await GetSettingsService.execute();

    // if (!settings.balance_port) {
    //   return;
    // }
    // if (port && port.isOpen) {
    //   return;
    // }

    port = new SerialPort(
      /*settings.balance_port*/ "COM1",
      {
        baudRate: 9600,
        dataBits: 7,
        stopBits: 1,
        parity: "none",
        autoOpen: true,
      },
      () => {
        port?.on("error", function (err: any) {
          // sendLog({
          //   title: "Erro ao obter peso da balança",
          //   payload: err.message,
          // });
          event.reply("balance:get:response", { error: true });
        });
      }
    );
  } catch (err) {
    // sendLog({
    //   title: "Erro ao estabelecar conexão com balança",
    //   payload: err.message,
    // });
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
