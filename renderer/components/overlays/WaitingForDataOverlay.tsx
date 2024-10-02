import { Button, ButtonGroup, Loader, Stack, Text } from "@mantine/core";
import CenteredContent from "../ui/CenteredContent";
import { useRouter } from "next/router";

// TODO: Add function to close and reopen the UDP connection
const reconnectUDP = (): null => {
  console.info("User tried to open a new UDP connection...");
  // 1. Show modal and disable button
  // 2. Send close and reconnect to the background
  // 3. On Response reenable button
  return null;
};

const WaitingForDataOverlay = () => {
  const router = useRouter();

  const cancelAndGoBack = (): void => {
    router.back();
  };

  return (
    <CenteredContent>
      <Stack align="center">
        <Loader aria-hidden size="xl" type="dots" />
        <Text fw="bold" fz="h1">
          Waiting for data...
        </Text>
        <Text opacity={0.8}>Is Kart Racing Pro currently running?</Text>
        <ButtonGroup mt="lg">
          <Button onClick={reconnectUDP}>Reconnect</Button>
          <Button onClick={cancelAndGoBack} variant="default">
            Cancel
          </Button>
        </ButtonGroup>
      </Stack>
    </CenteredContent>
  );
};

export default WaitingForDataOverlay;
