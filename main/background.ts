import path from "path";
import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import { createWindow, extractNullTerminatedString } from "./helpers";
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

  // Handles the incoming upd packets from the game
  udpSocket.on("message", (d) => {
    if (!mainWindow) {
      throw new Error("Main window is not initialized. Unable to send data.");
    }

    const data = Buffer.from(d);

    // Extract the null-terminated string and its index from the data packet
    // All potential packet type strings are defined in the constants file under PACKET_TYPES.
    const { nullTerminator, nullTerminatorIndex } =
      extractNullTerminatedString(data);

    switch (nullTerminator) {
      case "data":
        //console.info("data")
        break;
      case "evnt":
        console.info("evnt");
        break;
      case "lap ": // DO NOT REMOVE THE TRAILING SPACE!
        console.info("lap ");
        break;
      case "sesn":
        console.info("sesn");
        break;
      case "splt":
        console.info("splt");
        break;
      default:
        console.warn("Unknown Packet Type!", nullTerminator);
        break;
    }

    // Get the current game state and session time
    let state: number = null;
    let time: number = null;

    // Only the `data` packet includes this data
    if (nullTerminator === "data") {
      state = data[nullTerminatorIndex + 1];

      // Retrieve the session time when the player is driving on the track.
      if (state !== 0) {
        time = data.readUInt32LE(nullTerminatorIndex + 5);
      }
    }

    // Check if the game state indicates that the karts are in the pit (state = 0)
    // In this case, valid kart data is not available!
    if (state === 0) {
      return mainWindow.webContents.send("udp-data", {
        data: nullTerminator,
        state,
        time,
        kartData: null,
      });
    }

    const kartDataBytes = data.subarray(nullTerminatorIndex + 9);

    if (nullTerminator === "data") {
      const kartData = parseKartData(kartDataBytes);

      mainWindow.webContents.send("udp-data", {
        data: nullTerminator,
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
