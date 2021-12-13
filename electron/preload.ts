import { contextBridge, ipcRenderer } from "electron";
import database from "./src/providers/database";
import { userFactory } from "./src/factories/userFactory";
import { storeFactory } from "./src/factories/storeFactory";
import { productFactory } from "./src/factories/productFactory";
import { saleFactory } from "./src/factories/saleFactory";

export const api = {
  send: (channel: string, func: Function, data?: any) => {
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
  store: storeFactory,
  product: productFactory,
  sale: saleFactory,
};
contextBridge.exposeInMainWorld("Main", { ...api });
