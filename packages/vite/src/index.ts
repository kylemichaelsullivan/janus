import { existsSync } from "node:fs";
import { overrideCandidates } from "@janus/core";
import { transformSource } from "@janus/compiler";

export interface JanusViteOptions {
  platform?: string;
}

export function janus(options: JanusViteOptions = {}) {
  const platform = options.platform ?? "web";
  return {
    name: "janus",
    enforce: "pre" as const,
    resolveId(source: string) {
      if (source.startsWith("\0")) return null;
      for (const candidate of overrideCandidates(source, platform)) {
        if (existsSync(candidate)) return candidate;
      }
      return null;
    },
    transform(code: string, id: string) {
      if (!/\.[jt]sx$/.test(id) || id.includes("node_modules")) return null;
      const result = transformSource(code, { platform, filename: id, sourceMaps: true });
      return { code: result.code, map: result.map };
    },
  };
}
