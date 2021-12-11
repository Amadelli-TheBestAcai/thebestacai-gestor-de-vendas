import { contextBridge, ipcRenderer } from "electron";

export const api = {
  send: (channel: string, func: Function, data: any) => {
    ipcRenderer.send(channel, data);
    ipcRenderer.once(`${channel}:response`, (_, ...args) => func(...args));
  },
};

contextBridge.exposeInMainWorld("Main", { ...api });
