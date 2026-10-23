import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@janus/headless";

export function AlertDialog({ children }: { children?: ReactNode }) {
  return <Dialog>{children}</Dialog>;
}

export function AlertDialogTrigger({ children }: { children?: ReactNode }) {
  return <DialogTrigger>{children}</DialogTrigger>;
}

export function AlertDialogContent({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <DialogContent>
      <DialogTitle>{title}</DialogTitle>
      {description ? <DialogDescription>{description}</DialogDescription> : null}
      {children}
    </DialogContent>
  );
}

export function AlertDialogAction({ children }: { children?: ReactNode }) {
  return <DialogClose>{children}</DialogClose>;
}

export function AlertDialogCancel({ children }: { children?: ReactNode }) {
  return <DialogClose>{children}</DialogClose>;
}
