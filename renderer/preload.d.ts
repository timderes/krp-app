import { IpcHandler } from "../main/preload";
import type DataPacket from "./types/DataPacket";

export interface ElectronAPI {
  onUdpData: (callback: (data: DataPacket) => void) => void;
}

declare global {
  interface Window {
    ipc: IpcHandler;
    electron: ElectronAPI;
  }
}
