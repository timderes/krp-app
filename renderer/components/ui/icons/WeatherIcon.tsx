import React from "react";

import {
  IconCloud,
  IconCloudOff,
  IconCloudRain,
  type IconProps,
  IconSun,
} from "@tabler/icons-react";

type WeatherIconProps = {
  weatherState: KartSession["m_iConditions"];
} & IconProps;

/**
 * Renders an icon based on the provided weather state. Allowed values:
 * - 0: Sunny
 * - 1: Cloudy
 * - 2: Rainy
 *
 * @param {WeatherIconProps} props - The component props.
 * @param {KartSession["m_iConditions"]} props.weatherState - The current weather state.
 * @returns {JSX.Element} The appropriate weather icon.
 */
const WeatherIcon = ({
  weatherState,
  ...props
}: WeatherIconProps): JSX.Element => {
  switch (weatherState) {
    case 0:
      return <IconSun aria-label="Sunny" {...props} />;
    case 1:
      return <IconCloud aria-label="Cloudy" {...props} />;
    case 2:
      return <IconCloudRain aria-label="Rainy" {...props} />;
    default:
      console.warn(`Unexpected weather state: ${weatherState}`);
      return <IconCloudOff aria-label="No weather data available" {...props} />;
  }
};

export default React.memo(WeatherIcon);
