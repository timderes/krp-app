const convertMillisecondsToTimer = (time: number): string => {
  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  // Pad hours, minutes, and seconds with leading zeros if necessary
  const padNumber = (num: number) => String(num).padStart(2, "0");

  // Returns the time as HH:MM:SS
  return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
};

export default convertMillisecondsToTimer;
