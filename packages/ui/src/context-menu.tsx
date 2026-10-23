import { useState, type ReactNode } from "react";
import { Button, Div, Li, Ul } from "@janus/primitives";

export function ContextMenu({
  items,
  children,
}: {
  items: Array<{ id: string; label: string; onSelect?: () => void }>;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Div
      className="ContextMenu"
      onContextMenu={(event) => {
        event.preventDefault();
        setOpen(true);
      }}
    >
      {children}
      {open ? (
        <Ul role="menu">
          {items.map((item) => (
            <Li key={item.id} role="none">
              <Button
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
              >
                {item.label}
              </Button>
            </Li>
          ))}
        </Ul>
      ) : null}
    </Div>
  );
}
