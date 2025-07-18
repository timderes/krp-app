import Store from "electron-store";

type AppSettingsStoreType = {
  upd_ip: string; // IP Address for the game data
  upd_port: number; // UDP Port for the game data
};

export const AppSettingsStore = new Store<AppSettingsStoreType>({
  defaults: {
    upd_ip: "127.0.0.1",
    upd_port: 30001,
  },
});
