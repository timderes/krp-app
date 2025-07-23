import Store from "electron-store";
import type TemperatureUnit from "../../renderer/types/TemperatureUnit";
import type SpeedUnit from "../../renderer/types/SpeedUnit";

export type AppSettingsStoreType = {
  upd_ip: string; // IP Address for the game data
  upd_port: number; // UDP Port for the game data
  game_path: string; // Path to the game installation
  save_path: string; // Path to save game data (Used to load mods, profiles, replays...)
  default_driver: string;
  temperature_unit: TemperatureUnit;
  speed_unit: SpeedUnit;
};

export const AppSettingsStore = new Store<AppSettingsStoreType>({
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
