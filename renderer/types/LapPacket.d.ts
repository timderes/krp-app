import type KartLap from "./KartLap";

type LapPacket = {
  lap: string; // null-terminated string
  kartLap: KartLap;
};

export default LapPacket;
