import type SpeedUnit from "../../types/SpeedUnit";
import { MPS_TO_KPH, MPS_TO_MPH } from "../constants";

/**
 * Converts speed from meters per second (m/s) to the specified unit.
 * @param speedInMeters - Speed in meters per second.
 * @param speedUnit - The unit to convert to (KPH or MPH).
 * @returns Speed in the specified unit.
 * @throws Error if speed is negative or unit is invalid.
 */
export const convertKartSpeed = (
  speedInMeters: number,
  speedUnit: SpeedUnit
): number => {
  if (speedInMeters < 0) {
    throw new Error("Speed cannot be negative!");
  }

  if (speedUnit === "KPH") {
    return speedInMeters * MPS_TO_KPH;
  }

  return speedInMeters * MPS_TO_MPH;
};

export default convertKartSpeed;
