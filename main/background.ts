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

    // Step 1: Extract the null-terminated string for 'data'
    let endOfStringIndex = data.indexOf(0);
    const stringData = data.subarray(0, endOfStringIndex).toString("utf-8");

    // Get the current game state
    const state = data[endOfStringIndex + 1];

    // State 0 means the karts stands in the pit... Therefore no data available...
    if (state === 0) {
      if (mainWindow) {
        mainWindow.webContents.send("udp-data", {
          data: stringData,
          state: state,
          time: null,
          kartData: null,
        });
      }
      return;
    }

    const time = data.readUInt32LE(endOfStringIndex + 5);

    // Remaining bytes for kartData
    const kartDataBytes = data.subarray(endOfStringIndex + 9);

    // Step 5: Parse kartData using defined structure
    const kartData = parseKartData(kartDataBytes);

    // Send parsed data to the renderer process
    if (mainWindow) {
      mainWindow.webContents.send("udp-data", {
        data: stringData,
        state: state,
        time: time,
        kartData: kartData,
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

function parseKartData(buffer: Buffer): KartData | null {
  try {
    const kartData: KartData = {
      m_iRPM: buffer.readInt32LE(0), // 4 bytes
      m_fCylinderHeadTemperature: buffer.readFloatLE(4), // 4 bytes
      m_fWaterTemperature: buffer.readFloatLE(8), // 4 bytes
      m_iGear: buffer.readInt32LE(12), // 4 bytes
      m_fFuel: buffer.readFloatLE(16), // 4 bytes
      m_fSpeedometer: buffer.readFloatLE(20), // 4 bytes
      m_fPosX: buffer.readFloatLE(24), // 4 bytes
      m_fPosY: buffer.readFloatLE(28), // 4 bytes
      m_fPosZ: buffer.readFloatLE(32), // 4 bytes
      m_fVelocityX: buffer.readFloatLE(36), // 4 bytes
      m_fVelocityY: buffer.readFloatLE(40), // 4 bytes
      m_fVelocityZ: buffer.readFloatLE(44), // 4 bytes
      m_fAccelerationX: buffer.readFloatLE(48), // 4 bytes
      m_fAccelerationY: buffer.readFloatLE(52), // 4 bytes
      m_fAccelerationZ: buffer.readFloatLE(56), // 4 bytes
      m_aafRot: [
        [
          buffer.readFloatLE(60),
          buffer.readFloatLE(64),
          buffer.readFloatLE(68),
        ], // 3x4 bytes
        [
          buffer.readFloatLE(72),
          buffer.readFloatLE(76),
          buffer.readFloatLE(80),
        ], // 3x4 bytes
        [
          buffer.readFloatLE(84),
          buffer.readFloatLE(88),
          buffer.readFloatLE(92),
        ], // 3x4 bytes
      ],
      m_fYaw: buffer.readFloatLE(96), // 4 bytes
      m_fPitch: buffer.readFloatLE(100), // 4 bytes
      m_fRoll: buffer.readFloatLE(104), // 4 bytes
      m_fYawVelocity: buffer.readFloatLE(108), // 4 bytes
      m_fPitchVelocity: buffer.readFloatLE(112), // 4 bytes
      m_fRollVelocity: buffer.readFloatLE(116), // 4 bytes
      m_fInputSteer: buffer.readFloatLE(120), // 4 bytes
      m_fInputThrottle: buffer.readFloatLE(124), // 4 bytes
      m_fInputBrake: buffer.readFloatLE(128), // 4 bytes
      m_fInputFrontBrakes: buffer.readFloatLE(132), // 4 bytes
      m_fInputClutch: buffer.readFloatLE(136), // 4 bytes
      m_afWheelSpeed: [
        buffer.readFloatLE(140), // 4 bytes
        buffer.readFloatLE(144), // 4 bytes
        buffer.readFloatLE(148), // 4 bytes
        buffer.readFloatLE(152), // 4 bytes
      ],
      m_aiWheelMaterial: [
        buffer.readInt32LE(156), // 4 bytes
        buffer.readInt32LE(160), // 4 bytes
        buffer.readInt32LE(164), // 4 bytes
        buffer.readInt32LE(168), // 4 bytes
      ],
      m_fSteerTorque: buffer.readFloatLE(172), // 4 bytes
    };

    return kartData;
  } catch (error) {
    console.error("Error parsing kart data:", error);
    return null;
  }
}

app.on("window-all-closed", () => {
  udpSocket.close();
  app.quit();
});
