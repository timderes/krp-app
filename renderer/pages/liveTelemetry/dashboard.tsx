import { useEffect, useState } from "react";
import WeatherIcon from "../../components/ui/icons/WeatherIcon";
import { Box, Grid, Group, Stack, Text } from "@mantine/core";
import getSessionType from "../../utils/ui/getSessionType";
import { IconClock } from "@tabler/icons-react";
import convertMillisecondsToTimer from "../../utils/ui/convertMillisecondsToTimer";
import convertKartSpeed from "../../utils/ui/convertKartSpeed";
import WaitingForDataOverlay from "../../components/overlays/WaitingForDataOverlay";

const LiveDashboard = () => {
  const [udpData, setUdpData] = useState<DataPacket | null>(null);
  const [sessionData, setSessionData] = useState<SessionPacket | null>(null);
  const [lapData, setLapData] = useState<LapPacket | null>(null);
  const [splitData, setSplitData] = useState<SplitPacket | null>(null);
  const [eventData, setEventData] = useState<EventPacket | null>(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.onUdpData((data) => {
        if ("data" in data) {
          setUdpData(data);
        }

        if ("evnt" in data) {
          setEventData(data);
        }

        if ("sesn" in data) {
          setSessionData(data);
        }

        if ("lap" in data) {
          setLapData(data);
        }

        if ("splitData" in data) {
          setSplitData(data);
        }
        // Add timeout so the app wont rerender to often?
      });
    }

    console.info(udpData, sessionData, lapData, splitData, eventData);
  }, []);

  return (
    <>
      {udpData ? (
        <>
          {eventData && sessionData ? (
            <Box bg="dark.6" c="white" p="xs">
              <Group gap="xl" justify="space-between">
                {getSessionType(eventData.eventData.m_iType)} @{" "}
                {eventData.eventData.m_szTrackName} (
                {eventData.eventData.m_fTrackLength.toFixed(2)}m) &ndash;
                Driver: {eventData.eventData.m_szDriverName}
                &nbsp;&mdash;&nbsp;
                {eventData.eventData.m_szKartName}
                <Group>
                  <WeatherIcon
                    weatherState={sessionData.kartSession.m_iConditions}
                  />
                  Air: {sessionData.kartSession.m_fAirTemperature}°C
                  &ndash;&nbsp; Track:&nbsp;
                  {sessionData.kartSession.m_fTrackTemperature.toFixed(1)}°C
                </Group>
              </Group>
              <Group justify="space-between">
                Setup: {sessionData.kartSession.m_szSetupFileName || "Default"}
                <Group fw="bolder">
                  <IconClock /> {convertMillisecondsToTimer(udpData.time)}
                </Group>
              </Group>
            </Box>
          ) : undefined}

          <Box>
            {udpData.state === 0 ? <>Kart is in Pit...</> : undefined}
            <Grid maw={1024} mx="auto" p="lg" grow>
              {lapData && udpData.state !== 0 ? (
                <>
                  <Grid.Col span={3}>
                    <Stack gap={0}>
                      <Text
                        fz="h1"
                        fw="bold"
                        bg={
                          eventData.eventData.m_afEngineTemperatureAlarm[0] >
                            udpData.kartData.m_fWaterTemperature ||
                          eventData.eventData.m_afEngineTemperatureAlarm[1] <
                            udpData.kartData.m_fWaterTemperature
                            ? "red"
                            : undefined
                        }
                      >
                        {udpData.kartData.m_fWaterTemperature.toFixed(1)}°C
                      </Text>
                      <Text
                        display="flex"
                        style={{
                          justifyContent: "space-between",
                        }}
                        fz="sm"
                        opacity={0.9}
                      >
                        WAT{" "}
                        <Text c="red.7" component="span" fw="bold">
                          {eventData.eventData.m_afEngineTemperatureAlarm[0] >
                          udpData.kartData.m_fWaterTemperature ? (
                            <>ENGINE TO COLD!</>
                          ) : undefined}
                          {eventData.eventData.m_afEngineTemperatureAlarm[1] <
                          udpData.kartData.m_fWaterTemperature ? (
                            <>ENGINE TO HOT!</>
                          ) : undefined}
                        </Text>
                      </Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Text fz="h1" ta="center" fw="bold">
                      {convertKartSpeed(
                        udpData.kartData.m_fSpeedometer,
                        "KPH"
                      ).toFixed(1)}
                    </Text>
                    <Text fz="sm" ta="center" opacity={0.9}>
                      KPH
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text fz="h1" fw="bold" ta="right">
                      {udpData.kartData.m_iRPM}
                    </Text>
                    <Text fz="sm" opacity={0.9} ta="right">
                      RPM
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text fz="h1" fw="bold">
                      {lapData.kartLap.m_iLapNum}
                    </Text>
                    <Text fz="sm" opacity={0.9}>
                      LAP
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Text fw="bold" fz="h1">
                      <>
                        {new Date(lapData.kartLap.m_iLapTime).getMinutes()}:
                        {new Date(lapData.kartLap.m_iLapTime).getSeconds()}:
                        {new Date(lapData.kartLap.m_iLapTime).getMilliseconds()}
                      </>
                    </Text>
                    <Text fz="sm" opacity={0.9}>
                      LAST LAP
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Text fz="sm" opacity={0.9}>
                      DIFF
                    </Text>
                  </Grid.Col>
                </>
              ) : undefined}
            </Grid>
          </Box>
        </>
      ) : (
        <WaitingForDataOverlay />
      )}
    </>
  );
};

export default LiveDashboard;
