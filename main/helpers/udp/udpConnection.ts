import dgram from "dgram";
import { AppSettingsStore } from "../../stores/AppSettings";

const UDP_IP = AppSettingsStore.get("upd_ip");
const UDP_PORT = AppSettingsStore.get("upd_port");

// TODO: Add reconnection when the user updates ip and port on the frontend.
const UDP_SOCKET = dgram
  .createSocket("udp4")
  .bind(UDP_PORT, UDP_IP, () => {
    console.info(`Listening for UDP packets on ${UDP_IP}:${UDP_PORT}`);
  })
  .on("error", (err) => {
    // TODO: The error handling here should be more robust...
    console.error(`UDP socket error:\n${err.stack}`);
  });

const handleUDPMessage = (callback: (data: Buffer) => void) => {
  UDP_SOCKET.on("message", (data) => {
    callback(data);
  });
};

const handleCloseUDPSocket = () => UDP_SOCKET.close();

export { handleCloseUDPSocket, handleUDPMessage, UDP_SOCKET as udpSocket };
