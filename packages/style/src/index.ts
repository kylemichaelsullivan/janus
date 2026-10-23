import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { mergeClassName } from "@janus/core";

const CN_CACHE = new Map<string, string>();
const CN_LIMIT = 256;

export function cn(...inputs: ClassValue[]): string {
  const merged = twMerge(clsx(inputs));
  const cached = CN_CACHE.get(merged);
  if (cached !== undefined) return cached;
  if (CN_CACHE.size >= CN_LIMIT) {
    const first = CN_CACHE.keys().next().value;
    if (first !== undefined) CN_CACHE.delete(first);
  }
  CN_CACHE.set(merged, merged);
  return merged;
}

export function useJanusClassName(semantic: string, user?: string): string {
  return cn(mergeClassName(semantic, user));
}

export function nativewindInterop(_component: unknown): void {
  // Placeholder for NativeWind cssInterop registration in Expo apps.
}

export { mergeClassName };
