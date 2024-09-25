import { useEffect, useState } from "react";
import type DataPacket from "../types/DataPacket";
import { GAME_STATE } from "../utils/constants";

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
          {/* 
          <p>
            <strong>UDP Data Received:</strong> {JSON.stringify(udpData)}
          </p> 
          */}
          <p>state: {GAME_STATE[udpData.state]}</p>

          {udpData.state !== 0 && (
            <>
              <p>rpm: {udpData.kartData.m_iRPM} RPM</p>
              <p>wTemp: {udpData.kartData.m_fWaterTemperature}°C</p>
              <p>cTemp: {udpData.kartData.m_fCylinderHeadTemperature}°C</p>
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
