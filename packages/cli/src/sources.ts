import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export function collectSources(root: string, acc: string[] = []): string[] {
  if (!existsSync(root)) return acc;
  for (const entry of readdirSync(root)) {
    if (entry === "node_modules" || entry === "dist" || entry === ".janus") continue;
    const full = join(root, entry);
    if (statSync(full).isDirectory()) collectSources(full, acc);
    else if (/\.[jt]sx$/.test(entry)) acc.push(full);
  }
  return acc;
}
