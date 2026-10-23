import { describe, expect, it } from "vitest";
import { migrateSource } from "./migrate.js";

describe("migrateSource", () => {
  it("rewrites HTML tags and injects a primitives import", () => {
    const result = migrateSource(
      `export function Hero() {\n  return (\n    <div>\n      <h1>Hi</h1>\n    </div>\n  );\n}\n`,
      "Hero.tsx",
    );
    expect(result.changed).toBe(true);
    expect(result.code).toContain('import { Div, H1 } from "@janus/primitives";');
    expect(result.code).toContain("<Div>");
    expect(result.code).toContain("<H1>Hi</H1>");
    expect(result.code).toContain("</Div>");
    expect(result.changes.map((item) => `${item.from}->${item.to}`)).toEqual(
      expect.arrayContaining(["div->Div", "h1->H1"]),
    );
  });

  it("merges into an existing primitives import", () => {
    const result = migrateSource(
      `import { Button } from "@janus/primitives";\nexport const X = () => <p>Hi</p>;\n`,
      "X.tsx",
    );
    expect(result.code).toContain('import { Button, P } from "@janus/primitives";');
    expect(result.code).toContain("<P>Hi</P>");
  });

  it("reports forbidden document tags without rewriting them", () => {
    const result = migrateSource(`export const Shell = () => <html><body /></html>;\n`, "Shell.tsx");
    expect(result.code).toContain("<html>");
    expect(result.residuals.some((item) => item.kind === "forbidden-html")).toBe(true);
  });

  it("records residual imports and Platform.OS", () => {
    const result = migrateSource(
      `import * as Dialog from "@radix-ui/react-dialog";\nimport styled from "styled-components";\nconst os = Platform.OS;\nexport const X = () => <div dangerouslySetInnerHTML={{ __html: "x" }} />;\n`,
      "Legacy.tsx",
    );
    expect(result.residuals.map((item) => item.kind)).toEqual(
      expect.arrayContaining(["radix", "css-in-js", "platform-os", "dangerously-set-html"]),
    );
    expect(result.code).toContain("<Div");
  });

  it("does not flag react-native imports in override files", () => {
    const result = migrateSource(
      `import { View } from "react-native";\nexport const X = () => <View />;\n`,
      "Hero.ios.tsx",
    );
    expect(result.residuals.some((item) => item.kind === "raw-rn")).toBe(false);
  });

  it("leaves createElement HTML as a residual", () => {
    const result = migrateSource(
      `import { createElement } from "react";\nexport const X = () => createElement("div", null, "Hi");\n`,
      "Create.tsx",
    );
    expect(result.residuals.some((item) => item.kind === "create-element-html")).toBe(true);
    expect(result.code).toContain('createElement("div"');
  });
});
