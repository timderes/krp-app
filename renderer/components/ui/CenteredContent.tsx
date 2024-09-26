import type { PropsWithChildren } from "react";
import { Center, type CenterProps } from "@mantine/core";

type CenteredContentProps = PropsWithChildren & CenterProps;

const CenteredContent = ({ children, ...props }: CenteredContentProps) => {
  return (
    <Center h={props.h ?? "100dvh"} {...props}>
      {children}
    </Center>
  );
};

export default CenteredContent;
