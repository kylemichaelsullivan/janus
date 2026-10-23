import type { ReactNode } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@janus/headless";

export function Drawer({ children }: { children?: ReactNode }) {
  return <Dialog>{children}</Dialog>;
}

export function DrawerTrigger({ children }: { children?: ReactNode }) {
  return <DialogTrigger>{children}</DialogTrigger>;
}

export function DrawerContent({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <DialogContent className="DrawerContent">
      <DialogTitle>{title}</DialogTitle>
      {children}
      <DialogClose>Close</DialogClose>
    </DialogContent>
  );
}
