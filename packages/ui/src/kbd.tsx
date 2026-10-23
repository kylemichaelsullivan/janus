import type { ReactNode } from "react";
import { Kbd as Primitive } from "@janus/primitives";
import { cn } from "@janus/style";

export function Kbd({ className, children }: { className?: string; children?: ReactNode }) {
  return <Primitive className={cn("rounded border px-1 font-mono text-xs", className)}>{children}</Primitive>;
}
