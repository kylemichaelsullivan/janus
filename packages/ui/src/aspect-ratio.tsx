import type { ReactNode } from "react";
import { Div } from "@janus/primitives";

export function AspectRatio({
  ratio = 16 / 9,
  children,
}: {
  ratio?: number;
  children?: ReactNode;
}) {
  return (
    <Div className="AspectRatio" style={{ aspectRatio: String(ratio) }}>
      {children}
    </Div>
  );
}
