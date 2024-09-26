import KartLap from "../../../renderer/types/KartLap";
import type LapPacket from "../../../renderer/types/LapPacket";

import extractNullTerminatedString from "../utils/extractNullTerminatedString";

// Function to parse the lap data packet
export const parseLapPacket = (buffer: Buffer): LapPacket | null => {
  try {
    // Extract null-terminated string for the lap data
    const { nullTerminator, nullTerminatorIndex } =
      extractNullTerminatedString(buffer);

    // Create a subarray for the kart lap data
    const kartLapBytes = buffer.subarray(nullTerminatorIndex + 1); // Move past the null-terminated string

    // Create the KartLap object
    const kartLap: KartLap = {
      m_iLapNum: kartLapBytes.readInt32LE(0), // 4 bytes
      m_iInvalid: kartLapBytes.readInt32LE(4), // 4 bytes
      m_iLapTime: kartLapBytes.readInt32LE(8), // 4 bytes
      m_iPos: kartLapBytes.readInt32LE(12), // 4 bytes
    };

    // Return the complete LapPacket object
    return {
      lap: nullTerminator,
      kartLap,
    };
  } catch (error) {
    // console.error("Error parsing lap packet:", error);
    return {
      lap: "lap",
      kartLap: null,
    };
  }
};
