import { contextBridge, ipcRenderer } from "electron";
import { checkInternet } from "./src/providers/internetConnection";
import { userFactory } from "./src/factories/userFactory";
import { storeFactory } from "./src/factories/storeFactory";
import { productFactory } from "./src/factories/productFactory";
import { saleFactory } from "./src/factories/saleFactory";
import { handlerFactory } from "./src/factories/handlerFactory";
import { storeCashFactory } from "./src/factories/storeCashFactory";
import { itemOutCartFactory } from "./src/factories/itemOutCartFactory";
import env from "./src/providers/env.json";

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
  hasInternet: async (): Promise<boolean> => await checkInternet(),
  env,
  user: userFactory,
  store: storeFactory,
  product: productFactory,
  sale: saleFactory,
  handler: handlerFactory,
  storeCash: storeCashFactory,
  itemOutCart: itemOutCartFactory,
};
contextBridge.exposeInMainWorld("Main", { ...api });
