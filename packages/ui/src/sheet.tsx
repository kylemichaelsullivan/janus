import type { ReactNode } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@janus/headless";

export function Sheet({ children }: { children?: ReactNode }) {
  return <Dialog>{children}</Dialog>;
}

export function SheetTrigger({ children }: { children?: ReactNode }) {
  return <DialogTrigger>{children}</DialogTrigger>;
}

export function SheetContent({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <DialogContent className="SheetContent">
      <DialogTitle>{title}</DialogTitle>
      {children}
      <DialogClose>Close</DialogClose>
    </DialogContent>
  );
}
