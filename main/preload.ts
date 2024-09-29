import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import type Packet from "../renderer/types/Packet";

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

contextBridge.exposeInMainWorld("ipc", handler);

contextBridge.exposeInMainWorld("electron", {
  onUdpData: (callback: (data: Packet) => void) => {
    ipcRenderer.on("udp-data", (event, data: Packet) => {
      callback(data);
    });
  },
});

export type IpcHandler = typeof handler;
