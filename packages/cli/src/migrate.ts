import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { migrateSource, type Residual } from "@janus/compiler";
import { detectHost } from "./detect-host.js";
import { initProject } from "./project.js";
import { collectSources } from "./sources.js";

export interface MigrateOptions {
  write?: boolean;
  force?: boolean;
  path?: string;
}

export interface MigrateReport {
  host: ReturnType<typeof detectHost>;
  writable: { ok: boolean; message: string };
  files: Array<{
    file: string;
    changed: boolean;
    changes: Array<{ from: string; to: string; line?: number }>;
    residuals: Residual[];
  }>;
  wrote: string[];
  scaffolded: string[];
}

export function gitWritable(cwd: string, force: boolean): { ok: boolean; message: string } {
  if (force) return { ok: true, message: "forced" };
  if (!existsSync(join(cwd, ".git"))) return { ok: true, message: "no git repository" };
  const result = spawnSync("git", ["status", "--porcelain"], { cwd, encoding: "utf8" });
  if (result.status !== 0) return { ok: true, message: "git status unavailable" };
  if (result.stdout.trim().length > 0) {
    return { ok: false, message: "Working tree is dirty. Commit or pass --force." };
  }
  return { ok: true, message: "clean" };
}

export function runMigrate(cwd: string, options: MigrateOptions = {}): MigrateReport {
  const host = detectHost(cwd);
  const writable = gitWritable(cwd, Boolean(options.force));
  const report: MigrateReport = { host, writable, files: [], wrote: [], scaffolded: [] };
  if (!host.ok) return report;
  if (options.write && !writable.ok) return report;

  const root = options.path ? join(cwd, options.path) : existsSync(join(cwd, "src")) ? join(cwd, "src") : cwd;
  const files = collectSources(root);

  if (options.write && !existsSync(join(cwd, "janus.config.json"))) {
    report.scaffolded = initProject(cwd, { overwrite: false });
  }

  for (const filename of files) {
    const source = readFileSync(filename, "utf8");
    const result = migrateSource(source, filename);
    const rel = relative(cwd, filename);
    report.files.push({
      file: rel,
      changed: result.changed,
      changes: result.changes,
      residuals: result.residuals.map((item) => ({ ...item, file: rel })),
    });
    if (options.write && result.changed) {
      writeFileSync(filename, result.code);
      report.wrote.push(rel);
    }
  }
  return report;
}

export function formatMigrateReport(report: MigrateReport, write: boolean): string {
  const lines: string[] = [];
  lines.push(`host: ${report.host.kind} (${report.host.ok ? "ok" : "refused"}) — ${report.host.message}`);
  if (!report.host.ok) return `REFUSED ${report.host.kind}: ${report.host.message}`;
  if (write && !report.writable.ok) return `fail git: ${report.writable.message}`;
  if (report.scaffolded.length > 0) {
    lines.push(`scaffolded ${report.scaffolded.join(", ")}`);
  }
  const changed = report.files.filter((file) => file.changed);
  lines.push(
    write
      ? `wrote ${report.wrote.length} file(s)`
      : `would rewrite ${changed.length} file(s) — pass --write to apply`,
  );
  for (const file of changed) {
    const unique = uniqueChanges(file.changes);
    lines.push(`  ${file.file}: ${unique.map((item) => `${item.from}→${item.to}`).join(", ")}`);
  }
  const residuals = report.files.flatMap((file) => file.residuals);
  if (residuals.length === 0) {
    lines.push("residuals: none");
  } else {
    lines.push(`residuals (${residuals.length}) — finish with the janus-migrate skill:`);
    for (const item of residuals) {
      const loc = item.line ? `:${item.line}` : "";
      lines.push(`  ${item.file}${loc} ${item.kind}: ${item.detail}`);
    }
  }
  return lines.join("\n");
}

function uniqueChanges(changes: Array<{ from: string; to: string }>): Array<{ from: string; to: string }> {
  const seen = new Set<string>();
  const out: Array<{ from: string; to: string }> = [];
  for (const item of changes) {
    const key = `${item.from}->${item.to}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function parseMigrateArgs(rest: string[]): MigrateOptions {
  const options: MigrateOptions = { write: false, force: false };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--write") options.write = true;
    else if (arg === "--dry-run") options.write = false;
    else if (arg === "--force") options.force = true;
    else if (arg === "--path") {
      options.path = rest[i + 1];
      i += 1;
    }
  }
  return options;
}
