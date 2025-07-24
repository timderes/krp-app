/**
 * Based on the `profile.ini` and `record.ini` files found in the save game directory
 * of the game.
 */
declare type Driver = {
  name: string;
  race_number: number;
  suit_name: string;
  suit_paint: string;
  suit_font: string;
  kart_id: string; // Current driven kart (e.g. `GFC_Kart_Rotax_senior`)
  dash: string; // eg. `mychron_4`
  records: PersonalTrackRecord[];
};

declare type PersonalTrackRecord = {
  unique_track_name: Track["unique_name"]; // Unique name of the track
  kart_id: string;
  time_in_seconds: number; // e.g. 56.337158
  timestamp: number; // Unix timestamp of the record
};
