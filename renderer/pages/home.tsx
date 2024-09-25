import { useEffect, useState } from "react";
import type DataPacket from "../types/DataPacket";

const Home = () => {
  const [udpData, setUdpData] = useState<DataPacket | null>(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.onUdpData((data) => {
        setUdpData(data);
        console.info(udpData);
      });
    }
  }, []);

  return (
    <>
      {udpData ? (
        <div>
          <p>
            <strong>UDP Data Received:</strong> {JSON.stringify(udpData)}
          </p>
          <p>state: {udpData.state}</p>
        </div>
      ) : (
        <p>Waiting for data... Is Kart Racing Pro running?</p>
      )}
    </>
  );
};

export default Home;
