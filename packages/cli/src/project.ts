import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function initProject(cwd: string, options: { overwrite?: boolean } = {}): string[] {
  const overwrite = options.overwrite ?? true;
  const written: string[] = [];
  const write = (rel: string, contents: string) => {
    const dest = join(cwd, rel);
    if (!overwrite && existsSync(dest)) return;
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, contents);
    written.push(rel);
  };
  write(
    "janus.config.json",
    `${JSON.stringify({ platform: "universal", emit: false }, null, 2)}\n`,
  );
  write(
    "AGENTS.md",
    `# Janus app\n\nUse \`@janus/primitives\`. Never write raw HTML or raw React Native primitives. One layer, one job. Put platform APIs in override files. Run Axe (web) or RNTL a11y tests in the same change.\n`,
  );
  return written;
}
