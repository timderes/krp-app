type KartLap = {
  m_iLapNum: number; // lap index
  m_iInvalid: number; // TODO: Confirm if 0 means valid and 1 (or another value) means invalid
  m_iLapTime: number; // milliseconds
  m_iPos: number; // 1 = best lap
};

export default KartLap;
