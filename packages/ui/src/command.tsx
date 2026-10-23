import { useState } from "react";
import { Button, Div, Input, Li, Ul } from "@janus/primitives";

export function Command({
  items,
}: {
  items: Array<{ id: string; label: string; onSelect?: () => void }>;
}) {
  const [query, setQuery] = useState("");
  const matches = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  return (
    <Div className="Command" role="dialog" aria-label="Command palette">
      <Input
        aria-label="Search commands"
        value={query}
        onChange={(event) => setQuery((event.target as HTMLInputElement).value)}
      />
      <Ul role="listbox">
        {matches.map((item) => (
          <Li key={item.id} role="none">
            <Button type="button" role="option" onClick={item.onSelect}>
              {item.label}
            </Button>
          </Li>
        ))}
      </Ul>
    </Div>
  );
}
