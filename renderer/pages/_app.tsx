import type { AppProps } from "next/app";
import {
  createTheme,
  ColorSchemeScript,
  MantineProvider,
  type MantineColorScheme,
} from "@mantine/core";

// Core styles are required for all packages
import "@mantine/core/styles.css";

const theme = createTheme({
  // Theme overrides here...
});

const defaultColorScheme: MantineColorScheme = "auto";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <ColorSchemeScript defaultColorScheme={defaultColorScheme} />
      <MantineProvider defaultColorScheme={defaultColorScheme} theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
};

export default App;
