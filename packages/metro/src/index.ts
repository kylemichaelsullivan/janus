import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { overrideCandidates } from "@janus/core";
import { transformSource } from "@janus/compiler";

export interface MetroLikeConfig {
  transformer?: { babelTransformerPath?: string; [key: string]: unknown };
  resolver?: {
    platforms?: string[];
    resolveRequest?: ResolveRequest;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export type ResolveRequest = (
  context: { resolveRequest?: ResolveRequest; originModulePath?: string },
  moduleName: string,
  platform: string | null,
) => { type: "sourceFile"; filePath: string } | unknown;

export interface JanusMetroOptions {
  platforms?: string[];
}

export function withJanus<T extends MetroLikeConfig>(config: T, options: JanusMetroOptions = {}): T {
  const next: T = {
    ...config,
    transformer: { ...config.transformer },
    resolver: { ...config.resolver },
  };
  next.resolver!.platforms = options.platforms ?? [
    "ios",
    "android",
    "web",
    "macos",
    "windows",
    "tvos",
    "visionos",
  ];
  const previous = config.resolver?.resolveRequest;
  next.resolver!.resolveRequest = (context, moduleName, platform) => {
    const resolved = resolveJanusModule(moduleName, platform ?? "native", context.originModulePath);
    if (resolved) return { type: "sourceFile", filePath: resolved };
    if (previous) return previous(context, moduleName, platform);
    return context.resolveRequest?.(context, moduleName, platform);
  };
  return next;
}

export function resolveJanusModule(
  moduleName: string,
  platform: string,
  origin?: string,
): string | undefined {
  if (!moduleName.startsWith(".") && !moduleName.startsWith("/")) return undefined;
  const baseDir = origin ? dirname(origin) : process.cwd();
  const absolute = moduleName.startsWith("/") ? moduleName : join(baseDir, moduleName);
  for (const candidate of overrideCandidates(absolute, platform)) {
    for (const ext of ["", ".tsx", ".ts", ".jsx", ".js"]) {
      const filePath = candidate.endsWith(ext) && ext !== "" ? candidate : `${candidate}${ext}`;
      if (existsSync(filePath)) return filePath;
    }
  }
  return undefined;
}

export function metroTransform(source: string, filename: string, platform: string): string {
  return transformSource(source, { platform, filename }).code;
}
