declare type DataPacket = {
  data: string; // null-terminated string "data"
  state: number; // 0: software running; 1: on-track, simulation paused; 2: on-track, simulation running
  time: number; // Current driving time in milliseconds. Will reset if the player enters the pit or exit to main menu
  kartData: KartData;
};

declare type EventPacket = {
  evnt: string; // null-terminated string "evnt"
  eventData: KartEvent;
};

declare type LapPacket = {
  lap: string; // null-terminated string "lap "
  kartLap: KartLap;
};

declare type SessionPacket = {
  sesn: string; // null-terminated string "sesn"
  kartSession: KartSession;
};

declare type SplitPacket = {
  splt: string; // null-terminated string "splt"
  split: number; // 0: the latest line crossed is the start / finish one; 1: the latest line crossed is a split one
  splitData: KartSplit;
};

declare type Packet =
  | DataPacket
  | EventPacket
  | LapPacket
  | SessionPacket
  | SplitPacket;
