import { useState, type ReactNode } from "react";
import { Div, Span } from "@janus/primitives";

export function Tooltip({ label, children }: { label: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Span
      className="Tooltip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open ? (
        <Div role="tooltip" className="TooltipContent">
          {label}
        </Div>
      ) : null}
    </Span>
  );
}
