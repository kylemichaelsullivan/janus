import type { ReactNode } from "react";
import { overrideCandidates, splitPlatformSuffix, stripSourceExtension } from "@janus/core";

/**
 * Janus does not implement a router. Apps use Expo Router.
 * Universal route files in app/ must keep a non-platform sibling for deep links.
 */
/** Passthrough until the app installs Expo Router and re-exports its Slot. */
export function Slot({ children }: { children?: ReactNode }) {
  return children ?? null;
}

export const ROUTER_CONVENTION = {
  appDir: "app",
  requireUniversalSibling: true,
  layouts: "_layout.tsx",
} as const;

export function routeOverrideCandidates(routeFile: string, platform: string): string[] {
  return overrideCandidates(routeFile, platform);
}

export function assertUniversalSibling(
  files: readonly string[],
  routeBase: string,
): { ok: true } | { ok: false; reason: string } {
  const { name } = splitPlatformSuffix(stripSourceExtension(routeBase).base);
  const hasPlain = files.includes(routeBase);
  const hasPlatformOnly = files.some((file) => {
    const split = splitPlatformSuffix(stripSourceExtension(file).base);
    return split.name === name && Boolean(split.platform);
  });
  if (hasPlatformOnly && !hasPlain) {
    return {
      ok: false,
      reason: `Route ${routeBase} needs a non-platform sibling so deep links stay universal.`,
    };
  }
  return { ok: true };
}
