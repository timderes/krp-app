import type DataPacket from "../../../renderer/types/DataPacket";
import type KartData from "../../../renderer/types/KartData";

import extractNullTerminatedString from "../utils/extractNullTerminatedString";

// Data Packet contains the current elapsed session time, the game state and current kart data (fuel, rpm, ...)
export const parseDataPacket = (buffer: Buffer): DataPacket | null => {
  let time: number = 0;

  try {
    const { nullTerminator, nullTerminatorIndex } =
      extractNullTerminatedString(buffer);

    const state = buffer[nullTerminatorIndex + 1];

    if (state !== 0) {
      time = buffer.readUInt32LE(nullTerminatorIndex + 5);
    }

    if (state === 0) {
      return {
        data: nullTerminator,
        state,
        time: null,
        kartData: null,
      };
    }

    const kartDataBytes = buffer.subarray(nullTerminatorIndex + 5);

    const kartData: KartData = {
      m_iRPM: kartDataBytes.readInt32LE(4), // 4 bytes
      m_fCylinderHeadTemperature: kartDataBytes.readFloatLE(8), // 4 bytes
      m_fWaterTemperature: kartDataBytes.readFloatLE(12), // 4 bytes
      m_iGear: kartDataBytes.readInt32LE(16), // 4 bytes
      m_fFuel: kartDataBytes.readFloatLE(20), // 4 bytes
      m_fSpeedometer: kartDataBytes.readFloatLE(24), // 4 bytes
      m_fPosX: kartDataBytes.readFloatLE(28), // 4 bytes
      m_fPosY: kartDataBytes.readFloatLE(32), // 4 bytes
      m_fPosZ: kartDataBytes.readFloatLE(36), // 4 bytes
      m_fVelocityX: kartDataBytes.readFloatLE(40), // 4 bytes
      m_fVelocityY: kartDataBytes.readFloatLE(44), // 4 bytes
      m_fVelocityZ: kartDataBytes.readFloatLE(48), // 4 bytes
      m_fAccelerationX: kartDataBytes.readFloatLE(52), // 4 bytes
      m_fAccelerationY: kartDataBytes.readFloatLE(56), // 4 bytes
      m_fAccelerationZ: kartDataBytes.readFloatLE(60), // 4 bytes
      m_aafRot: [
        [
          kartDataBytes.readFloatLE(64),
          kartDataBytes.readFloatLE(68),
          kartDataBytes.readFloatLE(72),
        ], // 3x4 bytes
        [
          kartDataBytes.readFloatLE(76),
          kartDataBytes.readFloatLE(80),
          kartDataBytes.readFloatLE(84),
        ], // 3x4 bytes
        [
          kartDataBytes.readFloatLE(88),
          kartDataBytes.readFloatLE(92),
          kartDataBytes.readFloatLE(96),
        ], // 3x4 bytes
      ],
      m_fYaw: kartDataBytes.readFloatLE(100), // 4 bytes
      m_fPitch: kartDataBytes.readFloatLE(104), // 4 bytes
      m_fRoll: kartDataBytes.readFloatLE(108), // 4 bytes
      m_fYawVelocity: kartDataBytes.readFloatLE(112), // 4 bytes
      m_fPitchVelocity: kartDataBytes.readFloatLE(116), // 4 bytes
      m_fRollVelocity: kartDataBytes.readFloatLE(120), // 4 bytes
      m_fInputSteer: kartDataBytes.readFloatLE(124), // 4 bytes
      m_fInputThrottle: kartDataBytes.readFloatLE(128), // 4 bytes
      m_fInputBrake: kartDataBytes.readFloatLE(132), // 4 bytes
      m_fInputFrontBrakes: kartDataBytes.readFloatLE(136), // 4 bytes
      m_fInputClutch: kartDataBytes.readFloatLE(140), // 4 bytes
      m_afWheelSpeed: [
        kartDataBytes.readFloatLE(144), // 4 bytes
        kartDataBytes.readFloatLE(148), // 4 bytes
        kartDataBytes.readFloatLE(152), // 4 bytes
        kartDataBytes.readFloatLE(156), // 4 bytes
      ],
      m_aiWheelMaterial: [
        kartDataBytes.readInt32LE(160), // 4 bytes
        kartDataBytes.readInt32LE(164), // 4 bytes
        kartDataBytes.readInt32LE(168), // 4 bytes
        kartDataBytes.readInt32LE(172), // 4 bytes
      ],
      m_fSteerTorque: kartDataBytes.readFloatLE(176), // 4 bytes
    };

    return { data: nullTerminator, state, kartData, time: time };
  } catch (error) {
    // console.error("Error parsing kart data:", error);

    return { data: "data", state: null, kartData: null, time: null };
  }
};
