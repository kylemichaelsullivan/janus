import {
  createElement,
  forwardRef,
  memo,
  type ComponentType,
  type JSX,
} from "react";
import {
  getRuntimePlatform,
  type MappingEntry,
} from "@janus/core";
import { omitAria, useJanusClassName, useMappedA11y } from "./hooks.js";
import { NativeHost, Newline } from "./native-host.js";

export type JanusPrimitiveProps = JSX.IntrinsicElements["div"] &
  JSX.IntrinsicElements["input"] &
  JSX.IntrinsicElements["a"] &
  JSX.IntrinsicElements["label"] &
  JSX.IntrinsicElements["progress"] &
  JSX.IntrinsicElements["details"] & {
    className?: string;
    onPress?: (event: unknown) => void;
  };

function isDev(): boolean {
  return Boolean(globalThis.process?.env?.NODE_ENV !== "production");
}

export function createPrimitive(entry: MappingEntry) {
  const Component = memo(
    forwardRef<unknown, JanusPrimitiveProps>(function JanusPrimitive(props, ref) {
      if (entry.status === "stub" && isDev()) {
        throw new Error(
          `<${entry.janus}> has no portable native equivalent.${entry.notes ? ` ${entry.notes}` : ""}`,
        );
      }

      const className = useJanusClassName(entry.janus, props.className);
      const platform = getRuntimePlatform();
      const rest = { ...(props as Record<string, unknown>) };
      delete rest.className;

      if (typeof rest.onPress === "function" && rest.onClick === undefined) {
        rest.onClick = rest.onPress;
      }
      delete rest.onPress;

      if (platform === "native") {
        const nativeRest = omitAria(rest);
        const a11y = useMappedA11y(props as Record<string, unknown>, entry.a11yRole);
        const { dropped: _dropped, ...a11yProps } = a11y;
        if (entry.native === "newline") {
          return createElement(Newline, null);
        }
        if (entry.native === "none") {
          return null;
        }
        const Tag = NativeHost[entry.native] ?? "div";
        return createElement(Tag as ComponentType<Record<string, unknown>> | string, {
          ...nativeRest,
          ...a11yProps,
          className,
          ref,
        });
      }

      if (entry.native === "newline") {
        return createElement(entry.web);
      }

      const implicitWebRole = ["a", "button", "input", "select", "textarea"].includes(entry.web);
      const role =
        props.role ??
        (entry.category === "heading" || entry.a11yRole === "none" || implicitWebRole
          ? undefined
          : entry.a11yRole);
      return createElement(entry.web, { ...rest, className, ref, ...(role ? { role } : {}) });
    }),
  );
  Component.displayName = entry.janus;
  return Component;
}
