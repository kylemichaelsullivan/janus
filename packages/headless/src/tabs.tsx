import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Button, Div } from "@janus/primitives";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children?: ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);
  const ctx = useMemo(() => ({ value, setValue }), [value]);
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}

export function TabsList({ children }: { children?: ReactNode }) {
  return (
    <Div role="tablist" aria-label="Tabs" className="TabsList">
      {children}
    </Div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children?: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs.");
  const selected = ctx.value === value;
  return (
    <Button
      role="tab"
      aria-selected={selected}
      className="TabsTrigger"
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </Button>
  );
}

export function TabsContent({ value, children }: { value: string; children?: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs.");
  if (ctx.value !== value) return null;
  return (
    <Div role="tabpanel" className="TabsContent">
      {children}
    </Div>
  );
}
