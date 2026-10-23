import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Button, Div } from "@janus/primitives";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export function Popover({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

export function PopoverTrigger({ children }: { children?: ReactNode }) {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverTrigger must be used within Popover.");
  return (
    <Button type="button" aria-expanded={ctx.open} onClick={() => ctx.setOpen(!ctx.open)}>
      {children}
    </Button>
  );
}

export function PopoverContent({ children }: { children?: ReactNode }) {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverContent must be used within Popover.");
  if (!ctx.open) return null;
  return (
    <Div role="dialog" aria-label="Popover" className="PopoverContent">
      {children}
    </Div>
  );
}
