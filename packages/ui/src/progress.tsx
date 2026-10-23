import { Progress as Primitive } from "@janus/primitives";

export function Progress({ value }: { value: number }) {
  return <Primitive value={value} max={100} aria-label="Progress" className="Progress" />;
}
