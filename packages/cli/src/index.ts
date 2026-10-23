import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { emitPlatformTrees } from "@janus/compiler";
import { mapping } from "@janus/core";
import { initProject } from "./project.js";
import { collectSources } from "./sources.js";
import { formatMigrateReport, parseMigrateArgs, runMigrate } from "./migrate.js";

export interface DoctorFinding {
  ok: boolean;
  id: string;
  message: string;
}

export function doctor(cwd: string): DoctorFinding[] {
  const findings: DoctorFinding[] = [];
  const pkgPath = join(cwd, "package.json");
  findings.push({
    ok: existsSync(pkgPath),
    id: "package",
    message: existsSync(pkgPath)
      ? "package.json found."
      : "No package.json in this directory.",
  });
  const metro = existsSync(join(cwd, "metro.config.js")) || existsSync(join(cwd, "metro.config.cjs"));
  const vite = existsSync(join(cwd, "vite.config.ts")) || existsSync(join(cwd, "vite.config.js"));
  findings.push({
    ok: metro || vite,
    id: "bundler",
    message: metro || vite
      ? `Bundler config found (${metro ? "Metro" : "Vite+"}).`
      : "No metro.config.* or vite.config.* — run janus init.",
  });
  findings.push({
    ok: mapping.length > 0,
    id: "mapping",
    message: `Mapping table has ${mapping.length} entries.`,
  });
  if (metro) {
    const metroFile = existsSync(join(cwd, "metro.config.js"))
      ? join(cwd, "metro.config.js")
      : join(cwd, "metro.config.cjs");
    const metroSrc = existsSync(metroFile) ? readFileSync(metroFile, "utf8") : "";
    findings.push({
      ok: metroSrc.includes("withJanus"),
      id: "plugin-order",
      message: metroSrc.includes("withJanus")
        ? "Metro wraps Expo config with withJanus before NativeWind."
        : "metro.config must call withJanus, then NativeWind.",
    });
  } else {
    findings.push({
      ok: true,
      id: "plugin-order",
      message: "Vite+ app — put janus() first in vite.config plugins.",
    });
  }
  const sources = collectSources(cwd);
  const usesDialog = sources.some((file) => readFileSync(file, "utf8").includes("<Dialog"));
  const hasHost = sources.some((file) => readFileSync(file, "utf8").includes("JanusPortalHost"));
  findings.push({
    ok: !usesDialog || hasHost,
    id: "portal",
    message:
      !usesDialog || hasHost
        ? "Portal host is present or unused."
        : "Dialog is used without JanusPortalHost.",
  });
  return findings;
}

export { initProject } from "./project.js";

export function addComponent(cwd: string, name: string, registryDir?: string): string {
  const registry =
    registryDir ??
    join(cwd, "node_modules", "@janus", "ui", "src");
  const source = join(registry, `${name}.tsx`);
  const destDir = join(cwd, "src", "components", "ui");
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, `${name}.tsx`);
  if (existsSync(source)) {
    writeFileSync(dest, readFileSync(source, "utf8"));
  } else {
    writeFileSync(
      dest,
      `import { Div } from "@janus/primitives";\n\nexport function ${pascal(name)}() {\n  return <Div className="${pascal(name)}" />;\n}\n`,
    );
  }
  return dest;
}

function pascal(value: string): string {
  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export { collectSources } from "./sources.js";
export { detectHost } from "./detect-host.js";
export { formatMigrateReport, runMigrate } from "./migrate.js";

export function buildEmit(cwd: string, platforms = ["web", "native"]): string {
  const src = existsSync(join(cwd, "src")) ? join(cwd, "src") : cwd;
  const files = collectSources(src).map((filename) => ({
    filename,
    source: readFileSync(filename, "utf8"),
  }));
  const outDir = join(cwd, ".janus");
  emitPlatformTrees(files, { platforms, outDir, sourceRoot: src });
  return relative(cwd, outDir);
}

export function runCommand(argv: string[], cwd = process.cwd()): string {
  const args =
    argv[0] === "node" || argv[0]?.endsWith("node") || argv[1]?.includes("janus")
      ? argv.slice(2)
      : argv;
  const [command, ...rest] = args;
  const cmd = command ?? "help";
  switch (cmd) {
    case "init":
      return `Wrote ${initProject(cwd).join(", ")}`;
    case "add": {
      const name = rest[0];
      if (!name) return "Usage: janus add <component>";
      return `Copied ${addComponent(cwd, name)}`;
    }
    case "build":
      return `Emitted ${buildEmit(cwd)}`;
    case "dev":
      return "janus dev delegates to expo start or vp dev.";
    case "doctor": {
      const findings = doctor(cwd);
      return findings.map((item) => `${item.ok ? "ok" : "fail"} ${item.id}: ${item.message}`).join("\n");
    }
    case "migrate": {
      const options = parseMigrateArgs(rest);
      return formatMigrateReport(runMigrate(cwd, options), Boolean(options.write));
    }
    default:
      return "janus init|add|build|dev|doctor|migrate";
  }
}
