import type KartData from "./KartData";
import type KartEvent from "./KartEvent";
import type KartLap from "./KartLap";
import type KartSession from "./KartSession";
import type KartSplit from "./KartSplit";

type DataPacket = {
  data: string; // null-terminated string "data"
  state: number; // 0: software running; 1: on-track, simulation paused; 2: on-track, simulation running
  time: number; // Current driving time in milliseconds. Will reset if the player enters the pit or exit to main menu
  kartData: KartData;
};

type EventPacket = {
  evnt: string; // null-terminated string "evnt"
  eventData: KartEvent;
};

type LapPacket = {
  lap: string; // null-terminated string "lap "
  kartLap: KartLap;
};

type SessionPacket = {
  sesn: string; // null-terminated string "sesn"
  kartSession: KartSession;
};

type SplitPacket = {
  splt: string; // null-terminated string "splt"
  split: number; // 0: the latest line crossed is the start / finish one; 1: the latest line crossed is a split one
  splitData: KartSplit;
};

type Packet =
  | DataPacket
  | EventPacket
  | LapPacket
  | SessionPacket
  | SplitPacket;

export { DataPacket, EventPacket, LapPacket, SessionPacket, SplitPacket };

export default Packet;
