import type KartSession from "./KartSession";

type SessionPacket = {
  sesn: string; // null-terminated string
  kartSession: KartSession;
};

export default SessionPacket;
