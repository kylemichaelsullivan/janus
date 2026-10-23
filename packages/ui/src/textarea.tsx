import { Textarea as Primitive, type JanusPrimitiveProps } from "@janus/primitives";
import { cn } from "@janus/style";

export function Textarea({ className, ...props }: JanusPrimitiveProps) {
  return <Primitive className={cn("min-h-24 border p-2", className)} {...props} />;
}
