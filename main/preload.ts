import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

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
  getAppSettings: () => {
    return ipcRenderer.invoke("get-app-settings");
  },
  saveAppSettings: (settings: AppSettingsStore) => {
    ipcRenderer.invoke("save-app-settings", settings);
  },
});

export type IpcHandler = typeof handler;
