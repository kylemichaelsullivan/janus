import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Button, Div, Li, Ul } from "@janus/primitives";

interface SelectContextValue {
  value?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setValue: (value: string) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export function Select({
  defaultValue,
  children,
}: {
  defaultValue?: string;
  children?: ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ctx = useMemo(() => ({ value, open, setOpen, setValue }), [value, open]);
  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ children }: { children?: ReactNode }) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be used within Select.");
  return (
    <Button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      className="SelectTrigger"
      onClick={() => ctx.setOpen(!ctx.open)}
    >
      {children ?? ctx.value ?? "Select"}
    </Button>
  );
}

export function SelectContent({ children }: { children?: ReactNode }) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectContent must be used within Select.");
  if (!ctx.open) return null;
  return (
    <Ul role="listbox" aria-label="Options" className="SelectContent">
      {children}
    </Ul>
  );
}

export function SelectItem({ value, children }: { value: string; children?: ReactNode }) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used within Select.");
  return (
    <Li role="none">
      <Button
        type="button"
        role="option"
        aria-selected={ctx.value === value}
        className="SelectItem"
        onClick={() => {
          ctx.setValue(value);
          ctx.setOpen(false);
        }}
      >
        {children}
      </Button>
    </Li>
  );
}

export function SelectValue() {
  const ctx = useContext(SelectContext);
  return <Div className="SelectValue">{ctx?.value}</Div>;
}
