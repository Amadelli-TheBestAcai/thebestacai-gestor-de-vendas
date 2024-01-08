import { ipcMain } from "electron";
import { settingsFactory } from "../factories/settingsFactory";
import { digitalBalance } from "../helpers/DigitalBalance";

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

    if (digitalBalance.port && digitalBalance.port.isOpen) {
      return;
    }

    digitalBalance.portName = settings?.balance_port;
    await digitalBalance.connect();
  } catch (err) {
    console.error(err);
  }
});

ipcMain.on("balance:get", async (event) => {
  const weight = await digitalBalance.read();
  return event.reply("balance:get:response", { weight });
});

ipcMain.on("balance:testConnection", async (event, portCOM) => {
  if (digitalBalance.port && digitalBalance.port.isOpen) {
    digitalBalance.disconnect();
    return event.reply("balance:testConnection:response", {
      success: false,
      message: `A porta ${digitalBalance.port?.path} foi desconectada`,
    });
  }

  digitalBalance.portName = portCOM;
  const response = await digitalBalance.connect();
  console.log({ response });
  return event.reply("balance:testConnection:response", response);
});
