import { app, BrowserWindow, screen, ipcMain, dialog } from "electron";
import * as path from "path";
import { inicializeControllers } from "./src/controllers";
import axios from "axios";
import { inicializeServerTef } from "./src/helpers/inicializeServerTef";
import { finalizeServerTef } from "./src/helpers/finalizeServerTef";

let win: Electron.BrowserWindow | null;

let isUpdating = false;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width,
    height,
    resizable: false,
    backgroundColor: "#191622",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setTitle("Gestor de Vendas [TREINAMENTO]");

  win.on("page-title-updated", function (e) {
    e.preventDefault();
  });

  win.on("close", (e) => {
    if (isUpdating) return;

    const choice = dialog.showMessageBoxSync(win as any, {
      type: "question",
      buttons: ["Sim", "Não"],
      title: "Confirmar",
      message: "Você tem certeza que deseja fechar o Gestor de Vendas?",
    });
    if (choice === 1) {
      e.preventDefault();
    }
  });

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL("http://localhost:3000/index.html");

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : "")
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });
  }
}

let isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(async () => {
  createWindow();
  inicializeControllers();
  const serverTefProcess = await inicializeServerTef();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", async () => {
    if (process.platform !== "darwin") {
      await finalizeServerTef();
      app.quit();
    }
  });
});

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version:response", app.getVersion());
});

ipcMain.handle("get-danfe", async (event, payload) => {
  const { data } = await axios({
    method: "GET",
    url: `https://api.focusnfe.com.br${payload.caminho_danfe}`,
  });

  return data;
});
