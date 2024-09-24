import { useEffect, useState } from "react";

interface UdpData {
  data: string;
}

const Home = () => {
  const [udpData, setUdpData] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.onUdpData((data: string) => {
        setUdpData(data);
      });
    }
  }, []);

  return (
    <div>
      <h1>Nextron + UDP</h1>
      {udpData ? (
        <div>
          <p>
            <strong>UDP Data Received:</strong> {JSON.stringify(udpData)}
          </p>
        </div>
      ) : (
        <p>Waiting for UDP data...</p>
      )}
    </div>
  );
};

export default Home;
