import { useState, type ReactNode } from "react";
import { Details, Div, Summary } from "@janus/primitives";

export function Accordion({ children }: { children?: ReactNode }) {
  return <Div className="Accordion">{children}</Div>;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Details open={open} onToggle={() => setOpen((value) => !value)}>
      <Summary>{title}</Summary>
      {children}
    </Details>
  );
}
