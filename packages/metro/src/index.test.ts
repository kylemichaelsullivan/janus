import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { metroTransform, resolveJanusModule, withJanus } from "./index.js";

describe("withJanus", () => {
  it("installs platforms and chains resolvers", () => {
    const calls: string[] = [];
    const config = withJanus(
      {
        resolver: {
          resolveRequest: (_ctx, name) => {
            calls.push(String(name));
            return { type: "sourceFile", filePath: String(name) };
          },
        },
      },
      { platforms: ["ios", "web"] },
    );
    expect(config.resolver?.platforms).toEqual(["ios", "web"]);
    const result = config.resolver?.resolveRequest?.({ originModulePath: "/app/index.tsx" }, "react", "ios");
    expect(calls).toEqual(["react"]);
    expect(result).toEqual({ type: "sourceFile", filePath: "react" });
  });

  it("resolves override files on disk", () => {
    const dir = join(tmpdir(), `janus-metro-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "Hero.ios.tsx"), "ios");
    writeFileSync(join(dir, "Hero.tsx"), "base");
    expect(resolveJanusModule("./Hero", "ios", join(dir, "index.tsx"))).toContain("Hero.ios.tsx");
    expect(resolveJanusModule("react-native", "ios")).toBeUndefined();
  });

  it("transforms source", () => {
    const code = metroTransform(
      `import { H1 } from "@janus/primitives"; export const X = () => <H1>Hi</H1>;`,
      "Hero.tsx",
      "web",
    );
    expect(code).toContain("<h1");
  });

  it("falls back to context resolver", () => {
    const config = withJanus({});
    const hit = config.resolver?.resolveRequest?.(
      { resolveRequest: () => ({ type: "sourceFile", filePath: "fallback" }) },
      "left-pad",
      "web",
    );
    expect(hit).toEqual({ type: "sourceFile", filePath: "fallback" });
  });
});
