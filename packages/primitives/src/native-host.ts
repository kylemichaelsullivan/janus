import type { ComponentType, ReactNode } from "react";
import type { NativeTarget } from "@janus/core";

type HostComponent = string | ComponentType<Record<string, unknown>>;

export const NativeHost: Record<
  Exclude<NativeTarget, "newline" | "none">,
  HostComponent
> = {
  View: "div",
  Text: "span",
  Pressable: "button",
  TextInput: "input",
  Image: "img",
  ScrollView: "div",
  Link: "a",
  headless: "div",
  "expo-audio": "audio",
  "expo-video": "video",
  WebView: "iframe",
  Svg: "svg",
};

export function registerNativeHost(
  partial: Partial<typeof NativeHost>,
): void {
  Object.assign(NativeHost, partial);
}

export function Newline(): ReactNode {
  return "\n";
}
