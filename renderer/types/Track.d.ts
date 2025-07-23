type Track = {
  name: string;
  short_name: string;
  length: number; // Length of the track in meters
  altitude: number; // Altitude of the track in meters
  author: string; // Author of the track (e.g. PiBosSo)
  location: string; // Location of the track (e.g. Hertfordshire, UK)
  weather: {
    cloudy_probability: number; // Probability of cloudy weather (0.0-1.0)
    rain_probability: number; // Probability of rain (0.0-1.0)
  };
  preview_image: string; // Path to the preview image of the track
  track_map_image: string; // Path to the track map image
};

export default Track;
