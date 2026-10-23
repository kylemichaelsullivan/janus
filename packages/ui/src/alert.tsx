import type { ReactNode } from "react";
import { Div, Strong } from "@janus/primitives";
import { cn } from "@janus/style";

export function Alert({
  className,
  title,
  children,
}: {
  className?: string;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <Div role="alert" className={cn("border p-3", className)}>
      {title ? <Strong>{title}</Strong> : null}
      {children}
    </Div>
  );
}
