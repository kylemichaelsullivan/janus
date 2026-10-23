import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PortalContextValue {
  host: HTMLElement | null;
  setHost: (node: HTMLElement | null) => void;
}

const PortalContext = createContext<PortalContextValue>({
  host: null,
  setHost: () => undefined,
});

export function JanusPortalHost({ children }: { children?: ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const value = useMemo(() => ({ host, setHost }), [host]);
  return (
    <PortalContext.Provider value={value}>
      {children}
      <div ref={setHost} data-janus-portal-host="" />
    </PortalContext.Provider>
  );
}

export function usePortalHost(): HTMLElement | null {
  return useContext(PortalContext).host;
}
