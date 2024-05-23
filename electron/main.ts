import { app, BrowserWindow, screen, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import { inicializeControllers } from "./src/controllers";
import axios from "axios";
import { inicializeServerTef } from "./src/helpers/inicializeServerTef";

let win: Electron.BrowserWindow | null;

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

  autoUpdater.setFeedURL({
    provider: "github",
    repo: "thebestacai-gestor-de-vendas",
    owner: "Amadelli-TheBestAcai",
    releaseType: "release",
    private: false,
  });

  win.setTitle("Gestor de Vendas");

  win.on("page-title-updated", function (e) {
    e.preventDefault();
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

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  console.log(log_message);
  win?.webContents.send(
    "download-progress",
    progressObj.transferred.toString()
  );
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on("check_for_update", function () {
  autoUpdater.checkForUpdates();
});

app.whenReady().then(async () => {
  createWindow();
  inicializeControllers();
  const serverTefProcess = inicializeServerTef();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
      serverTefProcess.kill()
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
