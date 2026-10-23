import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@janus/headless";

/** Hover Card is degraded: it uses the same press-to-open surface as Popover. */
export function HoverCard({ children }: { children?: ReactNode }) {
  return <Popover>{children}</Popover>;
}

export function HoverCardTrigger({ children }: { children?: ReactNode }) {
  return <PopoverTrigger>{children}</PopoverTrigger>;
}

export function HoverCardContent({ children }: { children?: ReactNode }) {
  return <PopoverContent>{children}</PopoverContent>;
}
