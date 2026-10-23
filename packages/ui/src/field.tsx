import type { ReactNode } from "react";
import { Div } from "@janus/primitives";
import { Label } from "./label.js";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children?: ReactNode;
}) {
  return (
    <Div className="Field grid gap-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </Div>
  );
}
