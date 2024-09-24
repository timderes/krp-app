import { IpcHandler } from "../main/preload";

export interface ElectronAPI {
  onUdpData: (callback: (data: string) => void) => void;
}

declare global {
  interface Window {
    ipc: IpcHandler;
    electron: ElectronAPI;
  }
}
