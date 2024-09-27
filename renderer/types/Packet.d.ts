import DataPacket from "./DataPacket";
import EventPacket from "./EventPacket";
import LapPacket from "./LapPacket";
import SessionPacket from "./SessionPacket";
import SplitPacket from "./SplitPacket";

type Packet =
  | DataPacket
  | EventPacket
  | LapPacket
  | SessionPacket
  | SplitPacket;

export default Packet;
