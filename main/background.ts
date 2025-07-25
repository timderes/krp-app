import path from "path";
import { app, dialog, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import {
  createWindow,
  extractNullTerminatedString,
  parseDataPacket,
  parseEventPacket,
  parseLapPacket,
  parseSessionPacket,
  parseSplitPacket,
} from "./helpers";
import { AppSettingsStore } from "./stores/AppSettings";
import {
  handleCloseUDPSocket,
  handleUDPMessage,
} from "./helpers/udp/udpConnection";

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
    await mainWindow.loadURL("app://./");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }

  handleUDPMessage((data) => {
    if (!mainWindow) {
      console.error("Main window is not initialized. Unable to send data.");
    }

    // Extract the null-terminated string and its index from the data packet
    // All potential packet type strings are defined in the constants file under PACKET_TYPES.
    const { nullTerminator } = extractNullTerminatedString(data);

    switch (nullTerminator) {
      case "data":
        handleDataPacket(data);
        break;
      case "evnt":
        handleEventPacket(data);
        break;
      case "lap ":
        handleLapPacket(data);
        break;
      case "sesn":
        handleSessionPacket(data);
        break;
      case "splt":
        handleSplitPacket(data);
        break;
      default:
        console.warn("Unknown Packet Type:", nullTerminator);
        break;
    }
  });
})();

app.on("window-all-closed", () => {
  handleCloseUDPSocket();
  app.quit();
});

const handleDataPacket = (b: Buffer) => {
  const { time, state, data: nullTerminator, kartData } = parseDataPacket(b);

  mainWindow.webContents.send("udp-data", {
    data: nullTerminator,
    state,
    time,
    kartData,
  });
};

const handleEventPacket = (b: Buffer) => {
  const eventData = parseEventPacket(b);

  const { nullTerminator } = extractNullTerminatedString(b);

  mainWindow.webContents.send("udp-data", {
    evnt: nullTerminator,
    eventData: eventData,
  });
};

const handleLapPacket = (b: Buffer) => {
  const { lap: nullTerminator, kartLap } = parseLapPacket(b);

  mainWindow.webContents.send("udp-data", {
    lap: nullTerminator,
    kartLap,
  });
};

const handleSessionPacket = (b: Buffer) => {
  const { sesn: nullTerminator, kartSession } = parseSessionPacket(b);

  mainWindow.webContents.send("udp-data", {
    sesn: nullTerminator,
    kartSession,
  });
};

const handleSplitPacket = (b: Buffer) => {
  const { splt: nullTerminator, splitData, split } = parseSplitPacket(b);

  mainWindow.webContents.send("udp-data", {
    splt: nullTerminator,
    splitData,
    split,
  });
};

ipcMain.handle("get-app-settings", async () => {
  return AppSettingsStore.store;
});

ipcMain.handle("save-app-settings", async (_, settings) => {
  if (settings) {
    AppSettingsStore.set(settings);
  }
});

ipcMain.on("open-file-picker", (event, ...args) => {
  const { path: previousPath } = args[0];

  const filePath = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
    defaultPath: previousPath || app.getPath("home"),
  });

  if (filePath && filePath.length > 0) {
    event.sender.send("file-picker-response", filePath[0]);
  } else {
    event.sender.send("file-picker-response", null);
  }
});
