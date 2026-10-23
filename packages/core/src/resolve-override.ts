import type { JanusPlatform } from "./types.js";

export const FAMILY_ORDER: Record<string, readonly string[]> = {
  web: ["web"],
  ios: ["ios", "apple", "native"],
  android: ["android", "native"],
  macos: ["macos", "apple", "native"],
  windows: ["windows", "native"],
  tvos: ["tvos", "tv", "apple", "native"],
  visionos: ["visionos", "apple", "native"],
  tv: ["tv", "native"],
  apple: ["apple", "native"],
  native: ["native"],
};

export const SOURCE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"] as const;

export function familyFor(platform: string): readonly string[] {
  return FAMILY_ORDER[platform] ?? (platform === "web" ? ["web"] : [platform, "native"]);
}

export function stripSourceExtension(filePath: string): { base: string; ext: string } {
  for (const ext of SOURCE_EXTENSIONS) {
    if (filePath.endsWith(ext)) {
      return { base: filePath.slice(0, -ext.length), ext };
    }
  }
  return { base: filePath, ext: "" };
}

export function splitPlatformSuffix(stem: string): { name: string; platform?: string } {
  const match = stem.match(
    /^(.*)\.(web|ios|android|native|macos|windows|tvos|visionos|tv|apple)$/,
  );
  if (!match || match[1] === undefined) return { name: stem };
  return { name: match[1], platform: match[2] };
}

/**
 * Most-specific-wins candidate stems for a logical module name.
 * Example: Hero + ios → ["Hero.ios", "Hero.apple", "Hero.native", "Hero"]
 */
export function overrideCandidates(moduleName: string, platform: JanusPlatform | string): string[] {
  const { base, ext } = stripSourceExtension(moduleName);
  const { name } = splitPlatformSuffix(base);
  const families = familyFor(platform);
  const stems = [...families.map((family) => `${name}.${family}`), name];
  if (!ext) return stems;
  return stems.map((stem) => `${stem}${ext}`);
}

export function pickOverride(
  existingFiles: readonly string[],
  moduleName: string,
  platform: JanusPlatform | string,
): string | undefined {
  const existing = new Set(existingFiles);
  for (const candidate of overrideCandidates(moduleName, platform)) {
    if (existing.has(candidate)) return candidate;
  }
  return undefined;
}

export function isWebPlatform(platform: string): boolean {
  return platform === "web";
}

export function assertNoCrossFamily(
  fileName: string,
  platform: string,
): { ok: true } | { ok: false; reason: string } {
  const { platform: suffix } = splitPlatformSuffix(stripSourceExtension(fileName).base);
  if (!suffix) return { ok: true };
  if (isWebPlatform(platform) && suffix === "native") {
    return { ok: false, reason: "Web bundles must not resolve *.native.*" };
  }
  if (!isWebPlatform(platform) && suffix === "web") {
    return { ok: false, reason: "Native bundles must not resolve *.web.*" };
  }
  return { ok: true };
}
