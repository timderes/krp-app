import type KartData from "./KartData";

type DataPacket = {
  data: string; // null-terminated string
  state: number; // 0: software running; 1: on-track, simulation paused; 2: on-track, simulation running
  time: number; // milliseconds
  kartData: KartData;
};

export default DataPacket;
