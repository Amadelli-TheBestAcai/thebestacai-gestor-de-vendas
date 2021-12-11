import { ipcMain } from "electron";
import userModel from "../models/user";

ipcMain.on("user:login", async (_, message) => {
  const user = await userModel.login(message.username, message.password);
  _.reply("user:login:response", user);
});
