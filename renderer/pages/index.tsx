import { Stack } from "@mantine/core";
import Link from "next/link";

const IndexPage = () => {
  return (
    <Stack>
      <Link href="/liveTelemetry/dashboard">Live Telemetry</Link>
      <Link href="/settings">Settings</Link>
    </Stack>
  );
};

export default IndexPage;
