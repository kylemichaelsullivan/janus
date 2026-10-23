import { transformSync, type PluginObj } from "@babel/core";
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getEntryByWhatwg, janusComponentNames } from "@janus/core";

const JANUS_NAMES = new Set(janusComponentNames());
const OVERRIDE_RE = /\.(web|ios|android|native|macos|windows|tvos|visionos|tv|apple)\.[jt]sx?$/;

export type ResidualKind =
  | "forbidden-html"
  | "radix"
  | "css-in-js"
  | "raw-rn"
  | "platform-os"
  | "dangerously-set-html"
  | "create-element-html"
  | "next"
  | "router"
  | "parse-error";

export interface Residual {
  file: string;
  kind: ResidualKind;
  detail: string;
  line?: number;
}

export interface TagChange {
  from: string;
  to: string;
  line?: number;
}

export interface MigrateFileResult {
  code: string;
  changed: boolean;
  used: string[];
  changes: TagChange[];
  residuals: Residual[];
}

interface Replacement {
  start: number;
  end: number;
  text: string;
}

const CSS_IN_JS = [
  "styled-components",
  "@emotion/styled",
  "@emotion/react",
  "@emotion/css",
  "stitches",
  "@stitches/react",
  "styled-jsx",
];

export function migrateSource(source: string, filename = "file.tsx"): MigrateFileResult {
  const residuals: Residual[] = [];
  const used = new Set<string>();
  const alreadyImported = new Set<string>();
  const replacements: Replacement[] = [];
  const changes: TagChange[] = [];
  let primitivesImport: t.ImportDeclaration | undefined;
  const allowNative = OVERRIDE_RE.test(filename);

  try {
    transformSync(source, {
      filename,
      ast: false,
      code: false,
      configFile: false,
      babelrc: false,
      plugins: [
        (): PluginObj => ({
          visitor: {
            ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
              const spec = path.node.source.value;
              if (spec === "@janus/primitives") {
                primitivesImport = path.node;
                for (const specifier of path.node.specifiers) {
                  if (t.isImportSpecifier(specifier)) {
                    const imported = specifier.imported;
                    const name = t.isIdentifier(imported) ? imported.name : imported.value;
                    alreadyImported.add(name);
                  }
                }
              }
              pushImportResidual(filename, spec, path.node.loc?.start.line, residuals, allowNative);
            },
            JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
              rewriteJsxName(path.node.name, filename, replacements, changes, used, residuals);
            },
            JSXClosingElement(path: NodePath<t.JSXClosingElement>) {
              rewriteJsxName(path.node.name, filename, replacements, changes, used, residuals);
            },
            JSXAttribute(path: NodePath<t.JSXAttribute>) {
              if (t.isJSXIdentifier(path.node.name) && path.node.name.name === "dangerouslySetInnerHTML") {
                residuals.push({
                  file: filename,
                  kind: "dangerously-set-html",
                  detail: "dangerouslySetInnerHTML is not portable.",
                  line: path.node.loc?.start.line,
                });
              }
            },
            MemberExpression(path: NodePath<t.MemberExpression>) {
              if (
                !allowNative &&
                t.isIdentifier(path.node.object, { name: "Platform" }) &&
                t.isIdentifier(path.node.property, { name: "OS" })
              ) {
                residuals.push({
                  file: filename,
                  kind: "platform-os",
                  detail: "Platform.OS belongs in an override file.",
                  line: path.node.loc?.start.line,
                });
              }
            },
            CallExpression(path: NodePath<t.CallExpression>) {
              const callee = path.node.callee;
              const isCreate =
                (t.isIdentifier(callee) && callee.name === "createElement") ||
                (t.isMemberExpression(callee) &&
                  t.isIdentifier(callee.property, { name: "createElement" }));
              if (!isCreate) return;
              const first = path.node.arguments[0];
              if (t.isStringLiteral(first) && getEntryByWhatwg(first.value)) {
                residuals.push({
                  file: filename,
                  kind: "create-element-html",
                  detail: `createElement("${first.value}") — rewrite to JSX Janus primitives.`,
                  line: path.node.loc?.start.line,
                });
              }
            },
          },
        }),
      ],
      parserOpts: {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
        ranges: true,
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Parse failed.";
    return {
      code: source,
      changed: false,
      used: [],
      changes: [],
      residuals: [{ file: filename, kind: "parse-error", detail }],
    };
  }

  replacements.sort((a, b) => b.start - a.start);
  let code = source;
  for (const item of replacements) {
    code = `${code.slice(0, item.start)}${item.text}${code.slice(item.end)}`;
  }

  const missing = [...used].filter((name) => !alreadyImported.has(name)).sort();
  if (missing.length > 0) {
    code = injectPrimitiveImport(code, primitivesImport, missing);
  }

  return {
    code,
    changed: code !== source,
    used: [...used].sort(),
    changes,
    residuals,
  };
}

function rewriteJsxName(
  name: t.JSXOpeningElement["name"] | t.JSXClosingElement["name"],
  filename: string,
  replacements: Replacement[],
  changes: TagChange[],
  used: Set<string>,
  residuals: Residual[],
): void {
  if (!t.isJSXIdentifier(name)) return;
  const tag = name.name;
  if (!tag || tag[0] !== tag[0]?.toLowerCase()) {
    if (JANUS_NAMES.has(tag)) used.add(tag);
    return;
  }
  const entry = getEntryByWhatwg(tag);
  if (!entry) return;
  if (entry.status === "forbidden") {
    residuals.push({
      file: filename,
      kind: "forbidden-html",
      detail: `<${tag}> is document-level. Keep it in index.html.`,
      line: name.loc?.start.line,
    });
    return;
  }
  if (typeof name.start !== "number" || typeof name.end !== "number") return;
  replacements.push({ start: name.start, end: name.end, text: entry.janus });
  used.add(entry.janus);
  changes.push({ from: tag, to: entry.janus, line: name.loc?.start.line });
}

function injectPrimitiveImport(
  code: string,
  existing: t.ImportDeclaration | undefined,
  missing: string[],
): string {
  if (existing && typeof existing.start === "number" && typeof existing.end === "number") {
    const hasNonNamed = existing.specifiers.some((specifier) => !t.isImportSpecifier(specifier));
    if (hasNonNamed) {
      const statement = `\nimport { ${missing.join(", ")} } from "@janus/primitives";`;
      return `${code.slice(0, existing.end)}${statement}${code.slice(existing.end)}`;
    }
    const named: string[] = [];
    const seen = new Set<string>();
    for (const specifier of existing.specifiers) {
      if (!t.isImportSpecifier(specifier)) continue;
      const imported = specifier.imported;
      const importedName = t.isIdentifier(imported) ? imported.name : imported.value;
      const local = specifier.local.name;
      const text = importedName === local ? importedName : `${importedName} as ${local}`;
      named.push(text);
      seen.add(importedName);
    }
    for (const name of missing) {
      if (!seen.has(name)) named.push(name);
    }
    named.sort((a, b) => a.localeCompare(b));
    const statement = `import { ${named.join(", ")} } from "@janus/primitives";`;
    return `${code.slice(0, existing.start)}${statement}${code.slice(existing.end)}`;
  }
  const statement = `import { ${missing.join(", ")} } from "@janus/primitives";\n`;
  const match = code.match(/^(?:import\s.+?;\s*)+/m);
  if (match && match.index !== undefined) {
    const insertAt = match.index + match[0].length;
    return `${code.slice(0, insertAt)}${statement}${code.slice(insertAt)}`;
  }
  return `${statement}${code}`;
}

function pushImportResidual(
  file: string,
  spec: string,
  line: number | undefined,
  residuals: Residual[],
  allowNative: boolean,
): void {
  if (spec.startsWith("@radix-ui/") || spec.includes("/react-radix")) {
    residuals.push({ file, kind: "radix", detail: spec, line });
    return;
  }
  if (CSS_IN_JS.some((item) => spec === item || spec.startsWith(`${item}/`))) {
    residuals.push({ file, kind: "css-in-js", detail: spec, line });
    return;
  }
  if (spec === "react-native") {
    if (!allowNative) residuals.push({ file, kind: "raw-rn", detail: spec, line });
    return;
  }
  if (spec === "next" || spec.startsWith("next/")) {
    residuals.push({ file, kind: "next", detail: spec, line });
    return;
  }
  if (spec === "react-router" || spec.startsWith("react-router") || spec === "react-router-dom") {
    residuals.push({ file, kind: "router", detail: spec, line });
  }
}
