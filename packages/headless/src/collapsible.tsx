import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Button, Div } from "@janus/primitives";

interface CollapsibleContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export function Collapsible({
  defaultOpen = false,
  children,
}: {
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <CollapsibleContext.Provider value={value}>{children}</CollapsibleContext.Provider>;
}

export function CollapsibleTrigger({ children }: { children?: ReactNode }) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error("CollapsibleTrigger must be used within Collapsible.");
  return (
    <Button
      type="button"
      aria-expanded={ctx.open}
      className="CollapsibleTrigger"
      onClick={() => ctx.setOpen(!ctx.open)}
    >
      {children}
    </Button>
  );
}

export function CollapsibleContent({ children }: { children?: ReactNode }) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error("CollapsibleContent must be used within Collapsible.");
  if (!ctx.open) return null;
  return <Div className="CollapsibleContent">{children}</Div>;
}
