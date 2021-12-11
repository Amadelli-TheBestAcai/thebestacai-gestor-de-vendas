import { contextBridge, ipcRenderer } from "electron";
import database from "./src/providers/database";
import { userFactory } from "./src/factories/userFactory";

export const api = {
  send: (channel: string, func: Function, data: any) => {
    ipcRenderer.send(channel, data);
    ipcRenderer.once(`${channel}:response`, (_, ...args) => func(...args));
  },
  message: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  on: (channel: string, callback: Function) =>
    ipcRenderer.on(channel, (_, data) => callback(data)),
  once: (channel: string, callback: Function) =>
    ipcRenderer.once(channel, (_, data) => callback(data)),
  db_init: async () => await database.init(),
  user: userFactory,
};
contextBridge.exposeInMainWorld("Main", { ...api });
