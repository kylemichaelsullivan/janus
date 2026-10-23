import { useState, type ReactNode } from "react";
import { Button } from "./button.js";

export function Toggle({
  children,
  defaultPressed = false,
}: {
  children?: ReactNode;
  defaultPressed?: boolean;
}) {
  const [pressed, setPressed] = useState(defaultPressed);
  return (
    <Button
      type="button"
      aria-pressed={pressed}
      className="Toggle"
      onClick={() => setPressed((value) => !value)}
    >
      {children}
    </Button>
  );
}
