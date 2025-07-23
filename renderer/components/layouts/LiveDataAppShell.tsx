import { AppShell, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import type { PropsWithChildren } from "react";

type LiveDataAppShellProps = PropsWithChildren;

const LiveDataAppShell = ({ children }: LiveDataAppShellProps) => {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell header={{ height: "auto" }} padding="md">
      {children}
    </AppShell>
  );
};

export default LiveDataAppShell;
