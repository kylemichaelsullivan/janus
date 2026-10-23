import type { ReactNode } from "react";
import { Div } from "@janus/primitives";
import { cn } from "@janus/style";

export function ButtonGroup({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <Div role="group" className={cn("inline-flex gap-1", className)}>
      {children}
    </Div>
  );
}
