import { IpcHandler } from "../main/preload";
import type Packet from "./types/Packet";

export interface ElectronAPI {
  onUdpData: (callback: (data: Packet) => void) => void;
}

declare global {
  interface Window {
    ipc: IpcHandler;
    electron: ElectronAPI;
  }
}
