import { useId, useState } from "react";
import { Div, Input, Li, Ul } from "@janus/primitives";

export function Combobox({
  options,
  label,
}: {
  options: string[];
  label: string;
}) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const matches = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
  return (
    <Div className="Combobox">
      <Input
        role="combobox"
        aria-label={label}
        aria-expanded
        aria-controls={listId}
        aria-autocomplete="list"
        value={query}
        onChange={(event) => setQuery((event.target as HTMLInputElement).value)}
      />
      <Ul id={listId} role="listbox" aria-label={label}>
        {matches.map((option) => (
          <Li key={option} role="option">
            {option}
          </Li>
        ))}
      </Ul>
    </Div>
  );
}
