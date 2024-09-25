export const GAME_STATE = {
  0: "GAME_RUNNING",
  1: "ON_TRACK_PAUSED",
  2: "ON_TRACK",
} as const;

export const PACKET_TYPES = [
  "data",
  "evnt",
  "lap ", // DO NOT REMOVE THE TRAILING SPACE!
  "sesn",
  "splt",
] as const;

// Conversion factors for speed
export const MPS_TO_KPH = 3.6 as const;
export const MPS_TO_MPH = 2.236936 as const;
