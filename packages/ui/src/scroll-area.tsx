import type { ReactNode } from "react";
import { Div } from "@janus/primitives";
import { cn } from "@janus/style";

export function ScrollArea({ className, children }: { className?: string; children?: ReactNode }) {
  return <Div className={cn("ScrollArea overflow-auto", className)}>{children}</Div>;
}
