import { useEffect, useState } from "react";
import type DataPacket from "../types/DataPacket";
import { GAME_STATE } from "../utils/constants";
import convertMillisecondsToTimer from "../utils/ui/convertMillisecondsToTimer";
import WaitingForDataOverlay from "../components/overlays/WaitingForDataOverlay";
import {
  Flex,
  NumberFormatter,
  Progress,
  SemiCircleProgress,
  Stack,
} from "@mantine/core";
import convertKartSpeed from "../utils/ui/convertKartSpeed";
import {
  IconCloud,
  IconCloudOff,
  IconCloudRain,
  IconSteeringWheel,
  IconSun,
} from "@tabler/icons-react";
import SessionPacket from "../types/SessionPacket";
import LapPacket from "../types/LapPacket";
import SplitPacket from "../types/SplitPacket";

const KART_REV_LIMIT = 16000 as const; // TODO: Get value from packet

const Home = () => {
  const [udpData, setUdpData] = useState<DataPacket | null>(null);
  const [sessionData, setSessionData] = useState<SessionPacket | null>(null);
  const [lapData, setLapData] = useState<LapPacket | null>(null);
  const [splitData, setSplitData] = useState<SplitPacket | null>(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.onUdpData((data) => {
        if (data.data) {
          setUdpData(data);
        }

        if (data.sesn) {
          setSessionData(data);
        }

        if (data.lap) {
          setLapData(data);
        }

        if (data.splitData) {
          setSplitData(data);
        }
      });
    }
  }, []);

  const renderWeatherIcon = (weaterState: number) => {
    switch (weaterState) {
      case 0:
        return <IconSun />;
      case 1:
        return <IconCloud />;
      case 2:
        return <IconCloudRain />;
      default:
        <IconCloudOff />;
    }
  };

  return (
    <>
      {udpData ? (
        <div>
          <Flex gap="xs">
            <p>Game State: {GAME_STATE[udpData.state]}</p>
            <p>Session Time: {convertMillisecondsToTimer(udpData.time)}</p>

            {sessionData ? (
              <Flex gap="xs">
                <Flex gap="xs" align="center">
                  Weather:{" "}
                  {renderWeatherIcon(sessionData.kartSession.m_iConditions)}
                </Flex>
                <p>
                  WeatherTemp:{" "}
                  <NumberFormatter
                    decimalScale={1}
                    value={sessionData.kartSession.m_fAirTemperature}
                    suffix=" °C"
                  />
                </p>
                <p>
                  TrackTemp:{" "}
                  <NumberFormatter
                    decimalScale={1}
                    value={sessionData.kartSession.m_fTrackTemperature}
                    suffix=" °C"
                  />
                </p>
                <p>Setup Name: {sessionData.kartSession.m_szSetupFileName}</p>
              </Flex>
            ) : undefined}
          </Flex>

          {udpData.state !== 0 && (
            <>
              <Flex gap="xl">
                <SemiCircleProgress
                  fillDirection="left-to-right"
                  orientation="up"
                  filledSegmentColor={
                    udpData.kartData.m_iRPM > KART_REV_LIMIT - 1000
                      ? "red"
                      : "blue"
                  }
                  size={200}
                  thickness={12}
                  value={(udpData.kartData.m_iRPM / KART_REV_LIMIT) * 100}
                  labelPosition="center"
                  label={`${udpData.kartData.m_iRPM} RPM`}
                />

                <NumberFormatter
                  decimalScale={1}
                  value={convertKartSpeed(
                    udpData.kartData.m_fSpeedometer,
                    "KPH"
                  )}
                  suffix=" KPH"
                />
                <NumberFormatter
                  decimalScale={1}
                  value={convertKartSpeed(
                    udpData.kartData.m_fSpeedometer,
                    "MPH"
                  )}
                  suffix=" MPH"
                />
                <Stack>
                  <Flex direction="column">
                    Throttle
                    <Progress
                      color="green"
                      value={udpData.kartData.m_fInputThrottle * 100}
                      w={100}
                    />
                  </Flex>
                  <Flex direction="column">
                    Brake
                    <Progress
                      color="red"
                      value={udpData.kartData.m_fInputBrake * 100}
                      w={100}
                    />
                  </Flex>
                  <Flex direction="column">
                    Clutch
                    <Progress
                      color="red"
                      value={udpData.kartData.m_fInputClutch * 100}
                      w={100}
                    />
                  </Flex>
                </Stack>
                <Stack>
                  Steering
                  <IconSteeringWheel
                    size="7rem"
                    style={{
                      transform: `rotate(${udpData.kartData.m_fInputSteer}deg)`,
                    }}
                  />
                </Stack>
              </Flex>
              <p>
                Water Temperature:{" "}
                <NumberFormatter
                  decimalScale={2}
                  value={udpData.kartData.m_fWaterTemperature}
                  suffix=" °C"
                />
              </p>
              <p>
                Cylinder Head Temperature:{" "}
                <NumberFormatter
                  decimalScale={2}
                  value={udpData.kartData.m_fCylinderHeadTemperature}
                  suffix=" °C"
                />
              </p>
              <p>
                Fuel left:{" "}
                <NumberFormatter
                  decimalScale={1}
                  value={udpData.kartData.m_fFuel}
                  suffix=" l"
                />
              </p>
            </>
          )}

          <p>{JSON.stringify(lapData, null, 2)}</p>

          <p>{JSON.stringify(splitData, null, 2)}</p>
        </div>
      ) : (
        <WaitingForDataOverlay />
      )}
    </>
  );
};

export default Home;
