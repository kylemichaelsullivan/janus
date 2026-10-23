import { Input as PrimitiveInput, type JanusPrimitiveProps } from "@janus/primitives";
import { cn } from "@janus/style";

export function Input({ className, ...props }: JanusPrimitiveProps) {
  return <PrimitiveInput className={cn("border px-3 py-2", className)} {...props} />;
}
