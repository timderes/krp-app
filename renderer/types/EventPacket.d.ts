import type KartEvent from "./KartEvent";

type EventPacket = {
  evnt: string; // null-terminated string
  eventData: KartEvent;
};

export default EventPacket;
