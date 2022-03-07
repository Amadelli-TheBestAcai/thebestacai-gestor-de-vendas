import SerialPort from "serialport";
import { ipcMain } from "electron";
import { sleep } from "../helpers/sleep";
import { settingsFactory } from '../factories/settingsFactory'

let port: SerialPort | null = null;

ipcMain.on("balance:connect", async (event) => {
  try {
    const { has_internal_error, response: settings } = await settingsFactory.getSettings();

    if (has_internal_error) {
      event.reply("balance:get:response", { error: true });
      return
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
