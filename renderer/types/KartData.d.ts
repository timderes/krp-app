declare type KartData = {
  m_iRPM: number; // engine rpm
  m_fCylinderHeadTemperature: number; // degrees Celsius
  m_fWaterTemperature: number; // degrees Celsius
  m_iGear: number; // 0 = Neutral
  m_fFuel: number; // liters
  m_fSpeedometer: number; // meters/second
  m_fPosX: number;
  m_fPosY: number;
  m_fPosZ: number; // world position of a reference point attached to chassis (not CG)
  m_fVelocityX: number;
  m_fVelocityY: number;
  m_fVelocityZ: number; // velocity of CG in world coordinates. meters/second
  m_fAccelerationX: number;
  m_fAccelerationY: number;
  m_fAccelerationZ: number; // acceleration of CG local to chassis rotation, expressed in G (9.81 m/s²) and averaged over the latest 10ms
  m_aafRot: number[][]; // rotation matrix of the chassis
  m_fYaw: number;
  m_fPitch: number;
  m_fRoll: number; // degrees, -180 to 180
  m_fYawVelocity: number;
  m_fPitchVelocity: number;
  m_fRollVelocity: number; // degrees/second
  m_fInputSteer: number; // degrees. Negative = left
  m_fInputThrottle: number; // 0 to 1
  m_fInputBrake: number; // 0 to 1
  m_fInputFrontBrakes: number; // 0 to 1
  m_fInputClutch: number; // 0 to 1. 0 = Fully engaged
  m_afWheelSpeed: number[]; // meters/second. 0 = front-left; 1 = front-right; 2 = rear-left; 3 = rear-right
  m_aiWheelMaterial: number[]; // material index. 0 = not in contact
  m_fSteerTorque: number; // Nm
};
