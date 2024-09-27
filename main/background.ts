import path from "path";
import { app, BrowserWindow } from "electron";
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
import * as dgram from "dgram";

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

  // Handles the incoming upd packets from the game
  udpSocket.on("message", (d) => {
    if (!mainWindow) {
      throw new Error("Main window is not initialized. Unable to send data.");
    }

    const data = Buffer.from(d);

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

const handleDataPacket = (b: Buffer) => {
  const { time, state, data: nullTerminator, kartData } = parseDataPacket(b);

  mainWindow.webContents.send("udp-data", {
    data: nullTerminator,
    state: state,
    time: time,
    kartData: kartData,
  });
};

const handleEventPacket = (b: Buffer) => {
  const eventData = parseEventPacket(b);

  const { nullTerminator, nullTerminatorIndex } =
    extractNullTerminatedString(b);

  mainWindow.webContents.send("udp-data", {
    evnt: nullTerminator,
    kartData: eventData,
  });
};

const handleLapPacket = (b: Buffer) => {
  const { lap: nullTerminator, kartLap } = parseLapPacket(b);

  mainWindow.webContents.send("udp-data", {
    lap: nullTerminator,
    kartLap: kartLap,
  });
};

const handleSessionPacket = (b: Buffer) => {
  const { sesn: nullTerminator, kartSession } = parseSessionPacket(b);

  mainWindow.webContents.send("udp-data", {
    sesn: nullTerminator,
    kartSession: kartSession,
  });
};

const handleSplitPacket = (b: Buffer) => {
  const { splt, splitData, split } = parseSplitPacket(b);

  mainWindow.webContents.send("udp-data", {
    splt,
    splitData,
    split,
  });
};
