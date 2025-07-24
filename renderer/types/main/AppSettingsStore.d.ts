declare type AppSettingsStore = {
  upd_ip: string; // IP Address for the game data
  upd_port: number; // UDP Port for the game data
  game_path: string; // Path to the game installation
  save_path: string; // Path to save game data (Used to load mods, profiles, replays...)
  default_driver: string;
  temperature_unit: TemperatureUnit;
  speed_unit: SpeedUnit;
};
