import { Button, Loader, Stack, Text, Title } from "@mantine/core";
import CenteredContent from "../ui/CenteredContent";
import { useRouter } from "next/router";

const WaitingForDataOverlay = () => {
  const router = useRouter();

  const cancelAndGoBack = () => {
    router.back();
  };

  return (
    <CenteredContent>
      <Stack align="center">
        <Loader aria-hidden size="xl" type="dots" />
        <Title>Waiting for data...</Title>
        <Text opacity={0.8}>Is Kart Racing Pro currently running?</Text>
        <Button mt="lg" onClick={cancelAndGoBack} variant="default">
          Cancel
        </Button>
      </Stack>
    </CenteredContent>
  );
};

export default WaitingForDataOverlay;
