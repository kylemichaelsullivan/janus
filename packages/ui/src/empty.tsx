import type { ReactNode } from "react";
import { Div, P } from "@janus/primitives";

export function Empty({ children }: { children?: ReactNode }) {
  return (
    <Div className="Empty" role="status">
      <P>{children ?? "Nothing here yet."}</P>
    </Div>
  );
}
