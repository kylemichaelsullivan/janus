export type JanusStatus = "ok" | "degraded" | "stub" | "forbidden";

export type JanusCategory =
  | "document"
  | "sectioning"
  | "heading"
  | "text"
  | "phrasing"
  | "forms"
  | "tables"
  | "media"
  | "embedded"
  | "interactive";

export type NativeTarget =
  | "View"
  | "Text"
  | "Pressable"
  | "TextInput"
  | "Image"
  | "ScrollView"
  | "Link"
  | "newline"
  | "none"
  | "headless"
  | "expo-audio"
  | "expo-video"
  | "WebView"
  | "Svg";

export interface MappingEntry {
  janus: string;
  whatwg: string;
  category: JanusCategory;
  web: string;
  native: NativeTarget;
  a11yRole?: string;
  status: JanusStatus;
  notes?: string;
}

export type JanusPlatform =
  | "web"
  | "ios"
  | "android"
  | "native"
  | "macos"
  | "windows"
  | "tvos"
  | "visionos"
  | "tv"
  | "apple";

export interface AriaMapEntry {
  web: string;
  native: string;
  notes?: string;
}
