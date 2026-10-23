import type { ReactNode } from "react";
import { Span } from "@janus/primitives";
import { cn } from "@janus/style";

export function Badge({ className, children }: { className?: string; children?: ReactNode }) {
  return <Span className={cn("rounded-full px-2 py-0.5 text-xs", className)}>{children}</Span>;
}
