import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { janus } from "./index.js";

describe("janus vite plugin", () => {
  it("transforms tsx and skips node_modules", () => {
    const plugin = janus({ platform: "web" });
    const transformed = plugin.transform(
      `import { H1 } from "@janus/primitives"; export const X = () => <H1>Hi</H1>;`,
      "/app/Hero.tsx",
    );
    expect(transformed?.code).toContain("<h1");
    expect(plugin.transform("export const n = 1;", "/app/node_modules/x.tsx")).toBeNull();
    expect(plugin.transform("export const n = 1;", "/app/x.ts")).toBeNull();
  });

  it("resolves override files", () => {
    const plugin = janus({ platform: "web" });
    const file = join(tmpdir(), `hero-web-${Date.now()}.web.tsx`);
    writeFileSync(file, "web");
    expect(plugin.resolveId("\0virtual")).toBeNull();
    expect(plugin.resolveId(file.replace(".web.tsx", ""))).toBeDefined();
  });
});
