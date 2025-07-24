const getSessionType = (type: KartEvent["m_iType"]): SessionType => {
  switch (type) {
    case 0:
      return "IN_GAME_MENU";
    case 1:
      return "TESTING";
    case 2:
      return "RACE";
    case 4:
      return "CHALLENGE";
    default:
      console.warn("Unexpected Session Type:", type);
      return "UNKNOWN";
  }
};
export default getSessionType;
