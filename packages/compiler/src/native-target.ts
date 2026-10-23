import type { NativeTarget } from "@janus/core";

export type RewriteKind =
  | { kind: "html"; name: string }
  | { kind: "rn"; name: "View" | "Text" | "Pressable" | "TextInput" | "Image" }
  | { kind: "link" }
  | { kind: "newline" }
  | { kind: "passthrough" };

export function rewriteFor(
  platform: string,
  web: string,
  native: NativeTarget,
): RewriteKind {
  if (platform === "web") return { kind: "html", name: web };
  switch (native) {
    case "View":
    case "Text":
    case "Pressable":
    case "TextInput":
    case "Image":
      return { kind: "rn", name: native };
    case "Link":
      return { kind: "link" };
    case "newline":
      return { kind: "newline" };
    default:
      return { kind: "passthrough" };
  }
}
