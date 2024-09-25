import { useEffect, useState } from "react";
import type DataPacket from "../types/DataPacket";
import { GAME_STATE } from "../utils/constants";
import convertMillisecondsToTimer from "../utils/ui/convertMillisecondsToTimer";

const Home = () => {
  const [udpData, setUdpData] = useState<DataPacket | null>(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.onUdpData((data) => {
        setUdpData(data);
      });
    }
  }, []);

  return (
    <>
      {udpData ? (
        <div>
          <p>Game State: {GAME_STATE[udpData.state]}</p>
          <p>Session Time: {convertMillisecondsToTimer(udpData.time)}</p>

          {udpData.state !== 0 && (
            <>
              <p>RPM: {udpData.kartData.m_iRPM} RPM</p>
              <p>Water Temperature: {udpData.kartData.m_fWaterTemperature}°C</p>
              <p>
                Cylinder Head Temperature:{" "}
                {udpData.kartData.m_fCylinderHeadTemperature}
                °C
              </p>
            </>
          )}
        </div>
      ) : (
        <p>Waiting for data... Is Kart Racing Pro running?</p>
      )}
    </>
  );
};

export default Home;
