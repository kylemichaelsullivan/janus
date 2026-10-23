import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { addComponent, detectHost, doctor, initProject, runCommand } from "./index.js";

function scratch(): string {
  const dir = join(tmpdir(), `janus-cli-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe("janus CLI", () => {
  it("inits, doctors, adds, and emits", () => {
    const cwd = scratch();
    writeFileSync(join(cwd, "package.json"), "{}");
    writeFileSync(join(cwd, "vite.config.ts"), "export default {}");
    expect(initProject(cwd)).toContain("AGENTS.md");
    expect(doctor(cwd).every((item) => item.ok)).toBe(true);
    const added = addComponent(cwd, "button");
    expect(added).toContain("button.tsx");
    mkdirSync(join(cwd, "src"), { recursive: true });
    writeFileSync(
      join(cwd, "src", "Hero.tsx"),
      `import { H1 } from "@janus/primitives";\nexport const Hero = () => <H1>Hi</H1>;\n`,
    );
    expect(runCommand(["node", "janus", "build"], cwd)).toContain(".janus");
    expect(runCommand(["node", "janus", "dev"], cwd)).toContain("delegates");
    expect(runCommand(["node", "janus", "help"], cwd)).toContain("migrate");
    expect(runCommand(["node", "janus", "add"], cwd)).toContain("Usage");
    expect(runCommand(["node", "janus", "doctor"], cwd)).toContain("ok mapping");
  });

  it("reports missing project files", () => {
    const cwd = scratch();
    const findings = doctor(cwd);
    expect(findings.some((item) => !item.ok)).toBe(true);
  });

  it("detects supported and refused hosts", () => {
    const vite = scratch();
    writeFileSync(join(vite, "package.json"), JSON.stringify({ dependencies: { vite: "7.0.0" } }));
    expect(detectHost(vite).ok).toBe(true);
    const next = scratch();
    writeFileSync(join(next, "package.json"), JSON.stringify({ dependencies: { next: "16.0.0" } }));
    expect(detectHost(next).ok).toBe(false);
    expect(runCommand(["node", "janus", "migrate"], next)).toContain("REFUSED");
  });

  it("dry-runs then writes HTML to Janus primitives", () => {
    const cwd = scratch();
    writeFileSync(join(cwd, "package.json"), JSON.stringify({ dependencies: { vite: "7.0.0" } }));
    writeFileSync(join(cwd, "vite.config.ts"), "export default {}");
    mkdirSync(join(cwd, "src"), { recursive: true });
    const source = `export function Hero() {\n  return <div><h1>Hi</h1></div>;\n}\n`;
    writeFileSync(join(cwd, "src", "Hero.tsx"), source);
    const dry = runCommand(["node", "janus", "migrate"], cwd);
    expect(dry).toContain("would rewrite");
    expect(readFileSync(join(cwd, "src", "Hero.tsx"), "utf8")).toBe(source);
    const wrote = runCommand(["node", "janus", "migrate", "--write"], cwd);
    expect(wrote).toContain("wrote 1 file");
    const next = readFileSync(join(cwd, "src", "Hero.tsx"), "utf8");
    expect(next).toContain("<H1>Hi</H1>");
    expect(next).toContain("@janus/primitives");
    expect(existsSync(join(cwd, "janus.config.json"))).toBe(true);
  });
});
