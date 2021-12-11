import { contextBridge, ipcRenderer } from "electron";
import database from "./src/providers/database";
import { userFactory } from "./src/factories/userFactory";

export const api = {
  db_init: async () => await database.init(),
  user: userFactory,
  send: (channel: string, func: Function, data: any) => {
    ipcRenderer.send(channel, data);
    ipcRenderer.once(`${channel}:response`, (_, ...args) => func(...args));
  },
};
contextBridge.exposeInMainWorld("Main", { ...api });
