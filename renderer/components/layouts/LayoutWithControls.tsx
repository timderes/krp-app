import { AppShell, Center, Group, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import {
  IconGauge,
  IconHelmet,
  IconHome2,
  IconSettings,
  IconTrophy,
} from "@tabler/icons-react";
import Link from "next/link";
import IconWithTooltip from "../ui/icons/IconWithTooltip";

type LayoutWithControlsProps = {} & React.PropsWithChildren;

const headerHeight = 60;

export const routes = [
  {
    path: "/",
    icon: <IconHome2 />,
    label: "Home",
  },
  {
    path: "/liveTelemetry/dashboard",
    icon: <IconGauge />,
    label: "Live Telemetry",
  },
  {
    path: "/drivers",
    icon: <IconHelmet />,
    label: "Drivers",
  },
  {
    path: "/records",
    icon: <IconTrophy />,
    label: "Records",
  },
  {
    path: "/settings",
    icon: <IconSettings />,
    label: "Settings",
  },
];

const LayoutWithControls = ({ children }: LayoutWithControlsProps) => {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      header={{ height: headerHeight, collapsed: !pinned, offset: false }}
      padding="md"
    >
      <AppShell.Header>
        <Center h={headerHeight}>
          <Group gap="xl">
            {routes.map((route) => (
              <IconWithTooltip
                key={route.path}
                label={route.label}
                position="bottom"
                withArrow
              >
                <Link style={{ color: "inherit" }} href={route.path}>
                  {route.icon}
                </Link>
              </IconWithTooltip>
            ))}
          </Group>
        </Center>
      </AppShell.Header>
      <AppShell.Main
        pt={`calc(${rem(headerHeight)} + var(--mantine-spacing-md))`}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default LayoutWithControls;
