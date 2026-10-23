import { Input, type JanusPrimitiveProps } from "@janus/primitives";

export function Switch(props: JanusPrimitiveProps) {
  return <Input type="checkbox" role="switch" {...props} />;
}
