export const OVERRIDE_RE = /\.(web|ios|android|native|macos|windows|tvos|visionos|tv|apple)\.[jt]sx?$/;

export function isOverrideFile(filename: string): boolean {
  return OVERRIDE_RE.test(filename);
}

export function isInternalPackage(filename: string): boolean {
  return filename.includes(`${"packages"}/`) || filename.includes("node_modules");
}

export const RN_PRIMITIVES = new Set([
  "View",
  "Text",
  "Pressable",
  "TextInput",
  "Image",
  "ScrollView",
  "FlatList",
]);

export const DOCUMENT_PRIMITIVES = new Set([
  "Html",
  "Head",
  "Body",
  "Base",
  "Meta",
  "Link",
  "Title",
  "Style",
  "Script",
  "Noscript",
  "Template",
  "Slot",
]);
