import type { ReactNode } from "react";
import { Li } from "@janus/primitives";
import { cn } from "@janus/style";

export function Item({ className, children }: { className?: string; children?: ReactNode }) {
  return <Li className={cn("Item flex items-center gap-2", className)}>{children}</Li>;
}
