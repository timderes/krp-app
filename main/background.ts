import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import * as dgram from "dgram";

const isProd = process.env.NODE_ENV === "production";

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

  // UDP Communication Setup
  const UDP_PORT = 30001;
  const UDP_IP = "127.0.0.1";

  const udpSocket = dgram.createSocket("udp4");

  udpSocket.on("message", (msg) => {
    // Assuming the data is in a buffer format (binary)
    const data = Buffer.from(msg);

    // Example of how to parse different types from the buffer
    const someInteger = data.readInt32LE(0); // Read an integer (32-bit little-endian) from position 0
    const someFloat = data.readFloatLE(4); // Read a float (32-bit little-endian) from position 4
    const someString = data.toString("utf-8", 8, 20); // Read a string from position 8 to 20

    // Send parsed data to the renderer process
    if (mainWindow) {
      mainWindow.webContents.send("udp-data", {
        someInteger,
        someFloat,
        someString,
      });
    }
  });

  udpSocket.bind(UDP_PORT, UDP_IP, () => {
    console.log(`Listening for UDP packets on ${UDP_IP}:${UDP_PORT}`);
  });

  udpSocket.on("error", (err) => {
    console.log(`UDP socket error:\n${err.stack}`);
    udpSocket.close();
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});

// Existing IPC handler
ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
