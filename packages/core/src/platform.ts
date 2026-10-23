export type RuntimePlatform = "web" | "native";

export function getRuntimePlatform(): RuntimePlatform {
  const forced = globalThis.process?.env?.JANUS_PLATFORM;
  if (forced === "web" || forced === "native") return forced;
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return "native";
  }
  return "web";
}
