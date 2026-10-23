import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { JanusTransformError } from "./diagnostics.js";
import { emitPlatformTrees } from "./emit.js";
import { rewriteFor } from "./native-target.js";
import { transformSource, transformSourceSafe } from "./transform.js";

const HERO = `
import { H1, P, Div, Button, Input } from "@janus/primitives";
export function Hero() {
  return (
    <Div>
      <H1>Head1</H1>
      <P className="lead">Hello</P>
      <Button className={extra}>Go</Button>
      <Input />
    </Div>
  );
}
const extra = "primary";
`;

describe("transformSource web", () => {
  it("rewrites Janus primitives to semantic HTML", () => {
    const result = transformSource(HERO, { platform: "web", filename: "Hero.tsx" });
    expect(result.code).toContain("<h1");
    expect(result.code).toContain('className="H1"');
    expect(result.code).toContain("<p");
    expect(result.code).toContain('className="P lead"');
    expect(result.code).toContain("<div");
    expect(result.code).toContain("<button");
    expect(result.code).toContain("_janusCn");
    expect(result.code).toContain("<input");
    expect(result.map).toBeTruthy();
  });

  it("passes through unknown components and fragments", () => {
    const source = `import { H1 } from "@janus/primitives";
import { Other } from "lib";
export const X = () => <><Other /><H1 /></>;`;
    const result = transformSource(source, { platform: "web", filename: "x.tsx" });
    expect(result.code).toContain("<Other");
    expect(result.code).toContain("<h1");
  });

  it("tracks aliases and namespace imports", () => {
    const source = `import { H1 as Heading } from "@janus/primitives";
import * as Janus from "@janus/primitives";
import JanusDefault from "@janus/primitives";
export const X = () => <><Heading /><Janus.P /><JanusDefault.Span /></>;`;
    const result = transformSource(source, { platform: "web", filename: "x.tsx" });
    expect(result.code).toContain("<h1");
    expect(result.code).toContain("<p");
    expect(result.code).toContain("<span");
  });

  it("fails on raw HTML in strict mode and warns otherwise", () => {
    const source = `export const X = () => <h1>Nope</h1>;`;
    expect(() => transformSource(source, { platform: "web", filename: "app.tsx" })).toThrow(
      JanusTransformError,
    );
    const safe = transformSourceSafe(source, { platform: "web", filename: "app.tsx" });
    expect(safe.diagnostics[0]?.severity).toBe("error");
    const warn = transformSource(source, { platform: "web", filename: "app.tsx", strict: false });
    expect(warn.diagnostics[0]?.severity).toBe("warning");
    expect(warn.code).toContain("<h1");
  });

  it("ignores raw HTML in node_modules", () => {
    const source = `export const X = () => <h1>ok</h1>;`;
    const result = transformSource(source, {
      platform: "web",
      filename: "/app/node_modules/lib/index.tsx",
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("errors on forbidden primitives and warns on stubs", () => {
    const forbidden = `import { Html } from "@janus/primitives";
export const X = () => <Html />;`;
    expect(() => transformSource(forbidden, { platform: "web", filename: "x.tsx" })).toThrow(
      /document-level/,
    );
    const stub = `import { Canvas } from "@janus/primitives";
export const X = () => <Canvas />;`;
    const result = transformSource(stub, { platform: "web", filename: "x.tsx" });
    expect(result.diagnostics.some((item) => item.severity === "warning")).toBe(true);
    expect(result.code).toContain("<canvas");
  });
});

describe("transformSource native", () => {
  it("rewrites to RN primitives and injects imports", () => {
    const result = transformSource(HERO, { platform: "ios", filename: "Hero.tsx" });
    expect(result.code).toContain("from \"react-native\"");
    expect(result.code).toContain("<Text");
    expect(result.code).toContain("<View");
    expect(result.code).toContain("<Pressable");
    expect(result.code).toContain("<TextInput");
    expect(result.code).toContain('className="H1"');
  });

  it("rewrites A to Link and Br to a newline", () => {
    const source = `import { A, Br } from "@janus/primitives";
export const X = () => <A href="/">Go<Br /></A>;`;
    const result = transformSource(source, { platform: "android", filename: "x.tsx" });
    expect(result.code).toContain("expo-router");
    expect(result.code).toContain("<Link");
    expect(result.code).toContain("\"\\n\"");
  });

  it("passes through headless/media natives", () => {
    const source = `import { Select, Audio, Iframe } from "@janus/primitives";
export const X = () => <><Select /><Audio /><Iframe /></>;`;
    const result = transformSource(source, { platform: "native", filename: "x.tsx" });
    expect(result.code).toContain("<Select");
    expect(result.code).toContain("<Audio");
    expect(result.code).toContain("<Iframe");
  });

  it("can disable source maps", () => {
    const result = transformSource(`export const n = 1;`, {
      platform: "web",
      filename: "n.ts",
      sourceMaps: false,
    });
    expect(result.map).toBeFalsy();
  });
});

describe("rewriteFor", () => {
  it("covers every native target kind", () => {
    expect(rewriteFor("web", "h1", "Text")).toEqual({ kind: "html", name: "h1" });
    expect(rewriteFor("ios", "h1", "Text")).toEqual({ kind: "rn", name: "Text" });
    expect(rewriteFor("ios", "div", "View")).toEqual({ kind: "rn", name: "View" });
    expect(rewriteFor("ios", "button", "Pressable")).toEqual({ kind: "rn", name: "Pressable" });
    expect(rewriteFor("ios", "input", "TextInput")).toEqual({ kind: "rn", name: "TextInput" });
    expect(rewriteFor("ios", "img", "Image")).toEqual({ kind: "rn", name: "Image" });
    expect(rewriteFor("ios", "a", "Link")).toEqual({ kind: "link" });
    expect(rewriteFor("ios", "br", "newline")).toEqual({ kind: "newline" });
    expect(rewriteFor("ios", "canvas", "none")).toEqual({ kind: "passthrough" });
    expect(rewriteFor("ios", "select", "headless")).toEqual({ kind: "passthrough" });
    expect(rewriteFor("ios", "audio", "expo-audio")).toEqual({ kind: "passthrough" });
    expect(rewriteFor("ios", "video", "expo-video")).toEqual({ kind: "passthrough" });
    expect(rewriteFor("ios", "iframe", "WebView")).toEqual({ kind: "passthrough" });
    expect(rewriteFor("ios", "svg", "Svg")).toEqual({ kind: "passthrough" });
  });
});

describe("emit and safe transform", () => {
  it("writes sibling trees", () => {
    const dir = mkdtempSync(join(tmpdir(), "janus-emit-"));
    const from = join(dir, "src", "Hero.tsx");
    const trees = emitPlatformTrees(
      [{ filename: from, source: HERO }],
      { platforms: ["web", "native"], outDir: join(dir, ".janus"), sourceRoot: join(dir, "src") },
    );
    expect(trees).toHaveLength(2);
    const web = readFileSync(join(dir, ".janus", "web", "Hero.tsx"), "utf8");
    expect(web).toContain("<h1");
    expect(readFileSync(join(dir, ".janus", "web", "Hero.tsx.map"), "utf8")).toContain("mappings");
  });

  it("rethrows non-janus errors", () => {
    expect(() =>
      transformSourceSafe("const =", { platform: "web", filename: "bad.js" }),
    ).toThrow();
  });

  it("exposes diagnostic fields on JanusTransformError", () => {
    try {
      transformSource(`export const X = () => <div />;`, { platform: "web", filename: "app.tsx" });
      throw new Error("expected throw");
    } catch (error) {
      expect(error).toBeInstanceOf(JanusTransformError);
      expect((error as JanusTransformError).diagnostics.length).toBeGreaterThan(0);
      expect(new JanusTransformError([]).message).toBe("Janus transform failed");
    }
  });
});
