// Import types and utilities

import type KartEvent from "../../../renderer/types/KartEvent";

// Helper function to parse the event data bytes and return a KartEvent object
export const parseEventPacket = (data: Buffer): KartEvent => {
  const event: KartEvent = {
    m_szDriverName: "",
    m_szKartID: "",
    m_szKartName: "",
    m_iDriveType: 0,
    m_iNumberOfGears: 0,
    m_iMaxRPM: 0,
    m_iLimiter: 0,
    m_iShiftRPM: 0,
    m_iEngineCooling: 0,
    m_fEngineOptTemperature: 0,
    m_afEngineTemperatureAlarm: [0, 0],
    m_fMaxFuel: 0,
    m_szCategory: "",
    m_szDash: "",
    m_szTrackID: "",
    m_szTrackName: "",
    m_fTrackLength: 0,
    m_iType: 0,
  };

  let offset = 5; // TODO: Currently magic value. Code needs to be refactored :)

  // Parsing strings (assuming null-terminated strings for each string field)
  const extractString = () => {
    const nullIndex = data.indexOf(0, offset);
    const str = data.subarray(offset, nullIndex).toString("utf-8");
    offset = nullIndex + 1; // Move past the null terminator
    return str;
  };

  event.m_szDriverName = extractString();
  event.m_szKartID = extractString();
  event.m_szKartName = extractString();

  // Parsing integers (each integer is assumed to be 4 bytes in length)
  const extractInt = () => {
    const int = data.readInt32LE(offset);
    offset += 4;
    return int;
  };

  event.m_iDriveType = extractInt();
  event.m_iNumberOfGears = extractInt();
  event.m_iMaxRPM = extractInt();
  event.m_iLimiter = extractInt();
  event.m_iShiftRPM = extractInt();
  event.m_iEngineCooling = extractInt();

  // Parsing floating-point numbers (each float is assumed to be 4 bytes in length)
  const extractFloat = () => {
    const float = data.readFloatLE(offset);
    offset += 4;
    return float;
  };

  event.m_fEngineOptTemperature = extractFloat();

  // Parsing the engine temperature alarm (two floats for lower and upper limits)
  event.m_afEngineTemperatureAlarm = [
    extractFloat(), // lower limit
    extractFloat(), // upper limit
  ];

  event.m_fMaxFuel = extractFloat();

  // Parsing more strings
  event.m_szCategory = extractString();
  event.m_szDash = extractString();
  event.m_szTrackID = extractString();
  event.m_szTrackName = extractString();

  event.m_fTrackLength = extractFloat();
  event.m_iType = extractInt();

  return event;
};
