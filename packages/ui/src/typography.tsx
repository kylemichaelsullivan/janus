import type { ReactNode } from "react";
import { Blockquote, H1, H2, P } from "@janus/primitives";

export function TypographyH1({ children }: { children?: ReactNode }) {
  return <H1 className="text-4xl font-bold">{children}</H1>;
}

export function TypographyH2({ children }: { children?: ReactNode }) {
  return <H2 className="text-2xl font-semibold">{children}</H2>;
}

export function TypographyP({ children }: { children?: ReactNode }) {
  return <P className="leading-7">{children}</P>;
}

export function TypographyQuote({ children }: { children?: ReactNode }) {
  return <Blockquote className="border-l-2 pl-4 italic">{children}</Blockquote>;
}
