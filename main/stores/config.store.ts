import Store from "electron-store";

export type ConfigStoreType = {
  enable: number;
  port: number;
  ip: string;
  delay: number;
  info: number;
  gamePath: string;
  gameDocumentsPath: string;
};

const configStore = new Store<ConfigStoreType>({
  name: "config",
  defaults: {
    enable: 1,
    port: 30000,
    ip: "127.0.0.1:30001",
    delay: 1,
    info: 1,
    gamePath: undefined,
    gameDocumentsPath: undefined,
  },
});

export default configStore;
