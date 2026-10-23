import { Button as PrimitiveButton, type JanusPrimitiveProps } from "@janus/primitives";
import { cn } from "@janus/style";

export function Button({ className, ...props }: JanusPrimitiveProps) {
  return <PrimitiveButton className={cn("inline-flex items-center justify-center", className)} {...props} />;
}
