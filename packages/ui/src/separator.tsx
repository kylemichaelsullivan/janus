import { Hr } from "@janus/primitives";
import { cn } from "@janus/style";

export function Separator({ className }: { className?: string }) {
  return <Hr className={cn("my-4", className)} />;
}
