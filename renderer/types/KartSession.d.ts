type KartSession = {
  m_iSession: number; // testing: always 0. Race: 1 = practice; 2 = qualify; 3 = warmup; 4 = qualify heat; 5 = second chance heat; 6 = prefinal; 7 = final. Challenge: 0 = waiting; 1 = practice; 2 = race
  m_iSessionSeries: number; // ?
  m_iConditions: number; // 0 = sunny; 1 = cloudy; 2 = rainy
  m_fAirTemperature: number; // degrees Celsius
  m_fTrackTemperature: number; // degrees Celsius
  m_szSetupFileName: string; // ?
};

export default KartSession;
