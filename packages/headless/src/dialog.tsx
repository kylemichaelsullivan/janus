import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Button, Div } from "@janus/primitives";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog parts must be used within Dialog.");
  return ctx;
}

export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );
  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: { children?: ReactNode }) {
  const { setOpen } = useDialog();
  return (
    <Button type="button" onClick={() => setOpen(true)}>
      {children}
    </Button>
  );
}

export function DialogContent({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { open, setOpen } = useDialog();
  if (!open) return null;
  return (
    <Div
      role="dialog"
      aria-modal="true"
      aria-labelledby="janus-dialog-title"
      className={["DialogContent", className].filter(Boolean).join(" ")}
      onClick={() => setOpen(false)}
    >
      <Div onClick={(event) => event.stopPropagation()}>{children}</Div>
    </Div>
  );
}

export function DialogTitle({ children }: { children?: ReactNode }) {
  return (
    <Div id="janus-dialog-title" role="heading" aria-level={2} className="DialogTitle">
      {children}
    </Div>
  );
}

export function DialogDescription({ children }: { children?: ReactNode }) {
  return <Div className="DialogDescription">{children}</Div>;
}

export function DialogClose({ children }: { children?: ReactNode }) {
  const { setOpen } = useDialog();
  return (
    <Button type="button" onClick={() => setOpen(false)} className="DialogClose">
      {children ?? "Close"}
    </Button>
  );
}

export function useDismiss(onDismiss: () => void) {
  return useCallback(() => onDismiss(), [onDismiss]);
}
