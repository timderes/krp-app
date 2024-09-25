import type KartSplit from "./KartSplit";

type SplitPacket = {
  splt: string; // null-terminated string
  split: number; // 0: the latest line crossed is the start / finish one; 1: the latest line crossed is a split one
  splitData: KartSplit;
};
