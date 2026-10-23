import { createContext, useContext, useState, type ReactNode } from "react";
import { Div, Input, Label } from "@janus/primitives";

const RadioContext = createContext<{ name: string; value?: string; setValue: (v: string) => void } | null>(
  null,
);

export function RadioGroup({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  children?: ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <RadioContext.Provider value={{ name, value, setValue }}>
      <Div role="radiogroup" aria-label={name} className="RadioGroup">
        {children}
      </Div>
    </RadioContext.Provider>
  );
}

export function RadioGroupItem({ value, label }: { value: string; label: string }) {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("RadioGroupItem must be used within RadioGroup.");
  const id = `${ctx.name}-${value}`;
  return (
    <Div className="RadioGroupItem">
      <Input
        id={id}
        type="radio"
        name={ctx.name}
        checked={ctx.value === value}
        onChange={() => ctx.setValue(value)}
      />
      <Label htmlFor={id}>{label}</Label>
    </Div>
  );
}
