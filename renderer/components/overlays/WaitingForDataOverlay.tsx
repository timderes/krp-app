import { Loader, Stack, Text } from "@mantine/core";

import CenteredContent from "../ui/CenteredContent";

const WaitingForDataOverlay = () => {
  return (
    <CenteredContent>
      <Stack align="center">
        <Loader aria-hidden size="xl" type="dots" />
        <Text fw="bold" fz="h1">
          Waiting for data...
        </Text>
        <Text opacity={0.8}>Is Kart Racing Pro currently running?</Text>
      </Stack>
    </CenteredContent>
  );
};

export default WaitingForDataOverlay;
