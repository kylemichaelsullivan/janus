import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { scaffoldApp } from "./scaffold.js";

describe("create-janus-app", () => {
  it("writes an installable consumer tree", () => {
    const target = join(tmpdir(), `janus-app-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    scaffoldApp(target);
    const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.dependencies["@janus/react"]).toMatch(/^\^/);
    expect(pkg.dependencies["@janus/metro"]).toMatch(/^\^/);
    expect(pkg.devDependencies.janus).toMatch(/^\^/);
    expect(readFileSync(join(target, "metro.config.js"), "utf8")).toContain('from "@janus/metro"');
    expect(readFileSync(join(target, "app/_layout.tsx"), "utf8")).toContain("@janus/react");
    expect(readFileSync(join(target, "app/index.tsx"), "utf8")).toContain("@janus/react");
    expect(existsSync(join(target, "janus.config.json"))).toBe(true);
  });
});
