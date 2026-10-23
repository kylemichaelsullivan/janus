import { useState } from "react";
import { Button, Li, Ul } from "@janus/primitives";

export function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: Array<{ id: string; label: string; onSelect?: () => void }>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Ul className="DropdownMenu">
      <Li>
        <Button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {label}
        </Button>
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
      </Li>
    </Ul>
  );
}
