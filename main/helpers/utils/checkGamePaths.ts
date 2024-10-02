import { app, dialog } from "electron";
import configStore from "../../stores/config.store";

export const showAlert = async (options: Electron.MessageBoxOptions) => {
  return await dialog.showMessageBox(options);
};

// TODO: Add translations
const messageBoxStrings = {
  errorResponseCanceled: {
    title: "The application could not start!",
    message: "Please restart the application and select the missing folders.",
  },
  selectGamePath: {
    title: "Select Game Path",
    message:
      "Please select the folder containing the Kart Racing Pro executable file. This is necessary to ensure the application functions correctly.",
  },
  selectGameDocumentPath: {
    title: "Select Game Documents Path",
    message:
      'Please select the folder containing the Kart Racing Pro Replays, Mods, Profiles, and other related files. On Windows, this folder is usually located in your Documents directory under "PiBoSo".',
  },
};

const selectPath = async (
  message: string,
  title: string,
  pathKey: string,
  ...props: Electron.MessageBoxOptions[]
) => {
  await showAlert({
    type: "info",
    title: title,
    message: message,
    buttons: ["OK"],
    ...props.reduce((acc, prop) => ({ ...acc, ...prop }), {}),
  });

  const response = await dialog.showOpenDialog({
    title: title,
    properties: ["openDirectory"],
  });

  if (response.canceled) {
    await showAlert({
      type: "error",
      title: messageBoxStrings.errorResponseCanceled.title,
      message: messageBoxStrings.errorResponseCanceled.message,
      buttons: ["OK"],
    });
    app.quit();
  }

  const path = response.filePaths[0];
  configStore.set(pathKey, path);
  return path;
};

const checkGamePaths = async () => {
  const gamePath = configStore.get("gamePath");
  const gameDocumentsPath = configStore.get("gameDocumentsPath");

  if (!gamePath) {
    await selectPath(
      messageBoxStrings.selectGamePath.message,
      messageBoxStrings.selectGamePath.title,
      "gamePath"
    );
  }

  if (!gameDocumentsPath) {
    await selectPath(
      messageBoxStrings.selectGameDocumentPath.message,
      messageBoxStrings.selectGameDocumentPath.title,
      "gameDocumentsPath"
    );
  }
};

export default checkGamePaths;
