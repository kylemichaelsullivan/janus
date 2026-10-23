import { Div } from "@janus/primitives";
import { cn } from "@janus/style";

export function Skeleton({ className }: { className?: string }) {
  return <Div aria-hidden="true" className={cn("animate-pulse bg-neutral-200", className)} />;
}
