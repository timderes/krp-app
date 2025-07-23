import { useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Code,
  Container,
  Divider,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import type { AppSettingsStoreType } from "../../../main/stores/AppSettings";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import LayoutWithControls from "../../components/layouts/LayoutWithControls";

const SettingsPage = () => {
  const router = useRouter();
  const settingsFrom = useForm<AppSettingsStoreType>({
    initialValues: {
      upd_ip: "",
      upd_port: 0,
      game_path: "",
      save_path: "",
      temperature_unit: "CELSIUS",
      speed_unit: "KPH",
      default_driver: "",
    },
    validate: {
      upd_port: (value) =>
        value > 0 && value < 65536 ? null : "Port must be between 1 and 65535",
    },
  });

  useEffect(() => {
    window.electron
      .getAppSettings()
      .then((settings) => {
        settingsFrom.setValues(settings);
      })
      .then(() => {
        settingsFrom.resetDirty();
        settingsFrom.resetTouched();
      });
  }, []);

  const openFilePicker = (type: "game_path" | "save_path") => {
    window.ipc.send("open-file-picker", {
      type,
      path: settingsFrom.values[type] || undefined,
    });
    const unsubscribe = window.ipc.on(
      "file-picker-response",
      (resultPath: string) => {
        if (resultPath) {
          settingsFrom.setValues((prev) =>
            prev
              ? type === "game_path"
                ? { ...prev, game_path: resultPath }
                : { ...prev, save_path: resultPath }
              : prev
          );
          settingsFrom.isDirty();
        }
        unsubscribe();
      }
    );
  };

  const saveSettings = () => {
    window.electron.saveAppSettings(settingsFrom.values);
    settingsFrom.resetTouched();
    settingsFrom.resetDirty();
  };

  const goBack = () => router.back();

  return (
    <LayoutWithControls>
      <Container>
        <Stack>
          <Title>Settings</Title>
          <Stack>
            <Divider label="UDP Network Settings" labelPosition="left" />
            <Text opacity={0.8}>
              To enable telemetry data streaming from Kart Racing Pro, you'll
              need to configure the <Code>proxy_udp.ini</Code> file located in
              the Kart Racing Pro installation folder. Set the <Code>ip</Code>{" "}
              and <Code>port</Code> values to match the UDP IP address and port
              configured in the dashboard app settings.
            </Text>
            <TextInput
              {...settingsFrom.getInputProps("upd_ip")}
              label="UDP IP Address"
            />
            <NumberInput
              {...settingsFrom.getInputProps("upd_port")}
              label="UDP Port"
            />
            <Divider label="Dashboard Settings" labelPosition="left" />
            <Text opacity={0.8}>
              These settings control how information such as temperature and
              speed units are displayed and formatted in the dashboard
              interface.
            </Text>

            <Select
              label="Temperature"
              data={[
                { value: "CELSIUS", label: "Celsius (°C)" },
                { value: "FAHRENHEIT", label: "Fahrenheit (°F)" },
                { value: "KELVIN", label: "Kelvin (K)" },
              ]}
              value={settingsFrom.values.temperature_unit}
              onChange={(value) =>
                settingsFrom.setValues((prev) =>
                  prev
                    ? {
                        ...prev,
                        temperature_unit:
                          value as AppSettingsStoreType["temperature_unit"],
                      }
                    : prev
                )
              }
              {...settingsFrom.getInputProps("temperature_unit")}
            />

            <Select
              label="Speed"
              data={[
                { value: "KPH", label: "KPH" },
                { value: "MPH", label: "MPH" },
              ]}
              value={settingsFrom.values.speed_unit}
              onChange={(value) =>
                settingsFrom.setValues((prev) =>
                  prev
                    ? {
                        ...prev,
                        speed_unit: value as AppSettingsStoreType["speed_unit"],
                      }
                    : prev
                )
              }
              {...settingsFrom.getInputProps("speed_unit")}
            />
            <Divider label="Paths" labelPosition="left" />
            <Text opacity={0.8}>
              Configure the paths for the Kart Racing Pro installation and the
              save game directory.
            </Text>
            <TextInput
              {...settingsFrom.getInputProps("game_path")}
              label="Installation Path"
              description="The path where the Kart Racing Pro executable is located."
              onClick={() => openFilePicker("game_path")}
              // Disable typing
              onKeyDown={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />
            <TextInput
              {...settingsFrom.getInputProps("save_path")}
              label="Save Game Path"
              description="The path where your save games and mods are stored. On Windows this is usually in the Documents folder."
              onClick={() => openFilePicker("save_path")}
              onKeyDown={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />
            <Divider />
            <ButtonGroup>
              <Button
                ml="auto"
                disabled={!settingsFrom.isDirty() || !settingsFrom.isValid()}
                w="fit-content"
                onClick={saveSettings}
              >
                Save Settings
              </Button>
              <Button variant="default" onClick={() => goBack()}>
                Back
              </Button>
            </ButtonGroup>
          </Stack>
        </Stack>
      </Container>
    </LayoutWithControls>
  );
};

export default SettingsPage;
