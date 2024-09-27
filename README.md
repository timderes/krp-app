# Kart Racing Pro Telemetry

## Overview

**Kart Racing Pro Telemetry** is an Electron application that allows you to visualize real-time telemetry data from Kart Racing Pro. By leveraging the UDP data stream provided by the game.

## Features

- Real-time telemetry data display
- Event, session, lap, and split data streaming

## Requirements

- [Kart Racing Pro](https://www.kartracing-pro.com) (version 6 or later\*)

\*App is tested on Version 13e. The Game developer made some changes to the udp data between these versions.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/derechtenap/krp-app.git
   cd krp-app
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Run the application in dev mode:
   ```bash
   npm run dev
   ```

## Setup

To enable telemetry data streaming from Kart Racing Pro, you'll need to configure the `proxy_udp.ini` file located in the Kart Racing Pro installation folder:

```ini
[params]
enable = 1
port = 30000
ip = 127.0.0.1:30001
delay = 1
```

#### Configuration Parameters

- **port**: Outbound port for sending UDP packets.
- **ip**: Inbound address and optional port. If omitted, the outbound port is used.
- **delay**: Delay in hundredths of a second between packets.

### Enable Session, event, lap and split data

By default, the app will display only kart-related data. To enable the streaming of event, session, lap, and split data, add the following line to your `proxy_udp.ini` file:

```ini
info = 1
```

## Usage

Once the application is running and the Kart Racing Pro is configured correctly, you will start receiving real-time telemetry data.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Acknowledgements

- [Kart Racing Pro](https://www.kartracing-pro.com) for the plugin support.

## Contact

For issues or feature requests, please open an issue on GitHub.
