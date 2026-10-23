import { Input, type JanusPrimitiveProps } from "@janus/primitives";

export function Checkbox(props: JanusPrimitiveProps) {
  return <Input type="checkbox" {...props} />;
}
