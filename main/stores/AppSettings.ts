import Store from "electron-store";

export const AppSettingsStore = new Store<AppSettingsStore>({
  defaults: {
    upd_ip: "127.0.0.1",
    upd_port: 30001,
    // Default paths are undefined, should be set by the user
    game_path: undefined,
    save_path: undefined,
    default_driver: undefined,
    temperature_unit: "CELSIUS",
    speed_unit: "KPH",
  },
  // Minify the store data to save space
  serialize: (data) => JSON.stringify(data),
});
