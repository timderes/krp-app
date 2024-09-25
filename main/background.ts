import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import * as dgram from "dgram";
import KartData from "../renderer/types/KartData";

const isProd = process.env.NODE_ENV === "production";

const UDP_IP = "127.0.0.1";
const UDP_PORT = 30001;

const udpSocket = dgram.createSocket("udp4");

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let mainWindow: BrowserWindow | null = null;

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  udpSocket.on("message", (d) => {
    const data = Buffer.from(d);

    console.info(data);

    // Step 1: Extract the null-terminated string for 'data'
    let endOfStringIndex = data.indexOf(0); // Find the null terminator
    const stringData = data.slice(0, endOfStringIndex).toString("utf-8"); // Convert to string

    // Step 2: Extract the state
    const state = data[endOfStringIndex + 1]; // State follows the null terminator

    if (state === 0) {
      if (mainWindow) {
        mainWindow.webContents.send("udp-data", {
          data: stringData,
          state: state,
          time: 0,
          kartData: 0,
        });
      }
      return;
    }

    // Step 3: Extract the time
    const time = data.readUInt32LE(endOfStringIndex + 2); // Read next 4 bytes

    // Step 4: Extract kartData
    const kartDataBytes = data.slice(endOfStringIndex + 6); // Remaining bytes for kartData

    // Send parsed data to the renderer process
    if (mainWindow) {
      mainWindow.webContents.send("udp-data", {
        data: stringData,
        state: state,
        time: time,
        kartData: kartDataBytes,
      });
    }
  });

  udpSocket.bind(UDP_PORT, UDP_IP, () => {
    console.info(`Listening for UDP packets on ${UDP_IP}:${UDP_PORT}`);
  });

  udpSocket.on("error", (err) => {
    console.error(`UDP socket error:\n${err.stack}`);
    udpSocket.close();
  });
})();

app.on("window-all-closed", () => {
  udpSocket.close();
  app.quit();
});
