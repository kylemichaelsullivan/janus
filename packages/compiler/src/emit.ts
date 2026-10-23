import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { transformSource, type TransformOptions } from "./transform.js";

export interface EmitFile {
  filename: string;
  source: string;
}

export interface EmitOptions extends Omit<TransformOptions, "platform"> {
  platforms: string[];
  outDir: string;
  sourceRoot: string;
}

export interface EmittedTree {
  platform: string;
  files: { from: string; to: string }[];
}

export function emitPlatformTrees(files: readonly EmitFile[], options: EmitOptions): EmittedTree[] {
  return options.platforms.map((platform) => {
    const written: { from: string; to: string }[] = [];
    for (const file of files) {
      const result = transformSource(file.source, {
        ...options,
        platform,
        filename: file.filename,
      });
      const rel = relative(options.sourceRoot, file.filename);
      const dest = join(options.outDir, platform, rel);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, result.code, "utf8");
      if (result.map) {
        writeFileSync(`${dest}.map`, JSON.stringify(result.map), "utf8");
      }
      written.push({ from: file.filename, to: dest });
    }
    return { platform, files: written };
  });
}
