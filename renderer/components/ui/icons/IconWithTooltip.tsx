import { Tooltip, type TooltipProps } from "@mantine/core";

type IconWithTooltipProps = TooltipProps;

const IconWithTooltip = ({ children, ...props }: IconWithTooltipProps) => {
  return <Tooltip {...props}>{children}</Tooltip>;
};

export default IconWithTooltip;
