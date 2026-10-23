import { mapAriaToNative, WEB_ARIA_PROP_NAMES, type MappedA11y } from "@janus/core";
import { useJanusClassName } from "@janus/style";

export { useJanusClassName };

export function useMappedA11y(
  props: Record<string, unknown>,
  fallbackRole?: string,
): MappedA11y {
  return mapAriaToNative(props, fallbackRole);
}

export function omitAria<T extends Record<string, unknown>>(
  props: T,
): Omit<T, (typeof WEB_ARIA_PROP_NAMES)[number]> {
  const next = { ...props };
  for (const key of WEB_ARIA_PROP_NAMES) {
    delete next[key];
  }
  return next;
}
