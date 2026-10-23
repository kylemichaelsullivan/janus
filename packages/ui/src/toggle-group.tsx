import type { ReactNode } from "react";
import { Div } from "@janus/primitives";

export function ToggleGroup({ children }: { children?: ReactNode }) {
  return (
    <Div role="group" className="ToggleGroup">
      {children}
    </Div>
  );
}
