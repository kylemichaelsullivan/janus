import type { ReactNode } from "react";
import { Div, H3, P } from "@janus/primitives";
import { cn } from "@janus/style";

export function Card({ className, children }: { className?: string; children?: ReactNode }) {
  return <Div className={cn("rounded-xl border p-4", className)}>{children}</Div>;
}

export function CardHeader({ children }: { children?: ReactNode }) {
  return <Div className="CardHeader mb-2">{children}</Div>;
}

export function CardTitle({ children }: { children?: ReactNode }) {
  return <H3 className="CardTitle text-lg">{children}</H3>;
}

export function CardContent({ children }: { children?: ReactNode }) {
  return <P className="CardContent">{children}</P>;
}
