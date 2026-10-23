import type { ReactNode } from "react";
import { Option, Select } from "@janus/primitives";

export function NativeSelect({
  id,
  "aria-label": ariaLabel,
  children,
}: {
  id?: string;
  "aria-label"?: string;
  children?: ReactNode;
}) {
  return (
    <Select id={id} aria-label={ariaLabel} className="NativeSelect">
      {children}
    </Select>
  );
}

export function NativeSelectOption({ value, children }: { value: string; children?: ReactNode }) {
  return <Option value={value}>{children}</Option>;
}
