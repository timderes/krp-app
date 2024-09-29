import type KartSession from "../../../renderer/types/KartSession";
import type { SessionPacket } from "../../../renderer/types/Packet";

import extractNullTerminatedString from "../utils/extractNullTerminatedString";

// Session Packet contains session information for the karting game
export const parseSessionPacket = (buffer: Buffer): SessionPacket | null => {
  try {
    const { nullTerminator, nullTerminatorIndex } =
      extractNullTerminatedString(buffer);

    // The next fields after the null-terminated string will be read accordingly.
    const kartSessionBytes = buffer.subarray(nullTerminatorIndex + 1); // Move past the null-terminated string

    // Assuming m_iSession is at index 0, m_iSessionSeries at index 4, etc.
    const kartSession: KartSession = {
      m_iSession: kartSessionBytes.readInt32LE(0), // 4 bytes
      m_iSessionSeries: kartSessionBytes.readInt32LE(4), // 4 bytes
      m_iConditions: kartSessionBytes.readInt32LE(8), // 4 bytes
      m_fAirTemperature: kartSessionBytes.readFloatLE(12), // 4 bytes
      m_fTrackTemperature: kartSessionBytes.readFloatLE(16), // 4 bytes
      m_szSetupFileName: extractNullTerminatedString(
        kartSessionBytes.subarray(20)
      ).nullTerminator, // Read the null-terminated string
    };

    return {
      sesn: nullTerminator,
      kartSession,
    };
  } catch (error) {
    // Uncomment for debugging if needed
    // console.error("Error parsing session packet:", error);
    return { sesn: "sesn", kartSession: null };
  }
};
