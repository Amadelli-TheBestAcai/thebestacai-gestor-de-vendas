import { contextBridge, ipcRenderer } from "electron";
import { checkInternet } from "./src/providers/internetConnection";
import env from "./src/providers/env.json";
import {
  userFactory,
  commonFactory,
  handlerFactory,
  itemOutCartFactory,
  productFactory,
  saleFactory,
  settingsFactory,
  storeCashFactory,
  storeFactory
} from "./src/factories";

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
  settings: settingsFactory,
  common: commonFactory,
};
contextBridge.exposeInMainWorld("Main", { ...api });
