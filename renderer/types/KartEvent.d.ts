type KartEvent = {
  m_szDriverName: string;
  m_szKartID: string;
  m_szKartName: string;
  m_iDriveType: number; // 0 = direct; 1 = clutch; 2 = shifter
  m_iNumberOfGears: number;
  m_iMaxRPM: number;
  m_iLimiter: number;
  m_iShiftRPM: number;
  m_iEngineCooling: number; // 0 = aircooled; 1 = watercooled
  m_fEngineOptTemperature: number; // degrees Celsius
  m_afEngineTemperatureAlarm: number[]; // degrees Celsius. Lower and upper limits
  m_fMaxFuel: number; // liters
  m_szCategory: string;
  m_szDash: string;
  m_szTrackID: string;
  m_szTrackName: string;
  m_fTrackLength: number; // centerline length. meters
  m_iType: number; // 1 = testing; 2 = race; 4 = challenge
};

export default KartEvent;
