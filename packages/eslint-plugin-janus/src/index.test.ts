import { RuleTester } from "eslint";
import { describe, expect, it } from "vitest";
import plugin from "./index.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

describe("eslint-plugin-janus", () => {
  it("exposes recommended rules", () => {
    expect(Object.keys(plugin.rules)).toHaveLength(7);
    expect(plugin.configs.recommended.rules["janus/no-raw-html"]).toBe("error");
  });

  it("no-raw-html autofixes", () => {
    tester.run("no-raw-html", plugin.rules["no-raw-html"]!, {
      valid: [{ code: "export const X = () => <H1 />;", filename: "app.tsx" }],
      invalid: [
        {
          code: "export const X = () => <h1>Hi</h1>;",
          filename: "app.tsx",
          output: "export const X = () => <H1>Hi</H1>;",
          errors: 1,
        },
        {
          code: "export const X = () => <html />;",
          filename: "app.tsx",
          errors: 1,
        },
      ],
    });
  });

  it("no-raw-rn and no-platform-api allow overrides", () => {
    tester.run("no-raw-rn", plugin.rules["no-raw-rn"]!, {
      valid: [
        { code: `import { View } from "react-native";`, filename: "Hero.ios.tsx" },
        { code: `import { View } from "react-native";`, filename: "packages/core/x.ts" },
      ],
      invalid: [
        {
          code: `import { View } from "react-native";`,
          filename: "app/Hero.tsx",
          errors: 1,
        },
      ],
    });
    tester.run("no-platform-api", plugin.rules["no-platform-api"]!, {
      valid: [{ code: `const os = Platform.OS;`, filename: "Hero.native.tsx" }],
      invalid: [{ code: `const os = Platform.OS;`, filename: "Hero.tsx", errors: 1 }],
    });
  });

  it("remaining rules", () => {
    tester.run("missing-primitive-import", plugin.rules["missing-primitive-import"]!, {
      valid: [{ code: `import { H1 } from "@janus/primitives";\nexport const X = () => <H1 />;` }],
      invalid: [
        {
          code: `export const X = () => <H1>Hi</H1>;`,
          filename: "app.tsx",
          output: `import { H1 } from "@janus/primitives";\nexport const X = () => <H1>Hi</H1>;`,
          errors: 1,
        },
      ],
    });
    tester.run("require-janus-import", plugin.rules["require-janus-import"]!, {
      valid: [{ code: `import { H1 } from "@janus/primitives";` }],
      invalid: [{ code: `import { H1 } from "../primitives";`, errors: 1 }],
    });
    tester.run("no-document-primitives", plugin.rules["no-document-primitives"]!, {
      valid: [{ code: `export const X = () => <Div />;` }],
      invalid: [{ code: `export const X = () => <Html />;`, errors: 1 }],
    });
    tester.run("single-purpose", plugin.rules["single-purpose"]!, {
      valid: [{ code: `function Card() { return null }`, filename: "Card.tsx" }],
      invalid: [
        {
          code: `function Card() { return null }\nfunction CardTitle() { return null }`,
          filename: "Card.tsx",
          errors: 1,
        },
      ],
    });
  });
});
