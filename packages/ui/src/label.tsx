import { Label as PrimitiveLabel, type JanusPrimitiveProps } from "@janus/primitives";
import { cn } from "@janus/style";

export function Label({ className, ...props }: JanusPrimitiveProps) {
  return <PrimitiveLabel className={cn("text-sm font-medium", className)} {...props} />;
}
