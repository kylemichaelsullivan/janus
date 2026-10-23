import { getEntryByWhatwg, janusComponentNames } from "@janus/core";
import type { Rule } from "eslint";
import {
  DOCUMENT_PRIMITIVES,
  RN_PRIMITIVES,
  isInternalPackage,
  isOverrideFile,
} from "./util.js";

function jsxName(node: { name?: { type?: string; name?: string } }): string | undefined {
  if (node.name?.type === "JSXIdentifier") return node.name.name;
  return undefined;
}

export const noRawHtml: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Forbid raw HTML tags; use Janus primitives." },
    fixable: "code",
    schema: [],
  },
  create(context) {
    if (isInternalPackage(context.filename)) return {};
    return {
      JSXOpeningElement(node: Rule.Node & { name?: { type?: string; name?: string } }) {
        const name = jsxName(node);
        if (!name || name[0] !== name[0]?.toLowerCase()) return;
        const entry = getEntryByWhatwg(name);
        if (!entry) return;
        if (entry.status === "forbidden") {
          context.report({
            node,
            message: `Document-level <${name}> cannot be a Janus primitive. Keep it in index.html.`,
          });
          return;
        }
        context.report({
          node,
          message: `Raw HTML <${name}> is forbidden. Use <${entry.janus}>.`,
          fix(fixer) {
            const fixes = [fixer.replaceText(node.name, entry.janus)];
            const parent = (node as { parent?: { closingElement?: { name?: unknown } } }).parent;
            if (parent?.closingElement?.name) {
              fixes.push(fixer.replaceText(parent.closingElement.name as never, entry.janus));
            }
            return fixes;
          },
        });
      },
    };
  },
};

export const noRawRn: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Forbid raw React Native primitives in app source." },
    schema: [],
  },
  create(context) {
    if (isInternalPackage(context.filename) || isOverrideFile(context.filename)) return {};
    return {
      ImportDeclaration(node) {
        if (node.source.value !== "react-native") return;
        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportSpecifier" && "name" in specifier.imported) {
            const name = specifier.imported.name;
            if (RN_PRIMITIVES.has(name)) {
              context.report({
                node: specifier,
                message: `Raw React Native <${name}> is forbidden. Use a Janus primitive.`,
              });
            }
          }
        }
      },
    };
  },
};

export const noPlatformApi: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Forbid Platform.OS outside override files." },
    schema: [],
  },
  create(context) {
    if (isOverrideFile(context.filename) || isInternalPackage(context.filename)) return {};
    return {
      MemberExpression(node) {
        if (
          node.object.type === "Identifier" &&
          node.object.name === "Platform" &&
          node.property.type === "Identifier" &&
          node.property.name === "OS"
        ) {
          context.report({
            node,
            message: "Platform.OS is forbidden outside override files.",
          });
        }
      },
    };
  },
};

const JANUS_NAMES = new Set(janusComponentNames());

export const missingPrimitiveImport: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Import used Janus primitives from @janus/primitives." },
    fixable: "code",
    schema: [],
  },
  create(context) {
    if (isInternalPackage(context.filename)) return {};
    const used = new Set<string>();
    const imported = new Set<string>();
    let primitivesImport: Rule.Node | undefined;
    return {
      ImportDeclaration(node) {
        if (typeof node.source.value !== "string") return;
        if (node.source.value !== "@janus/primitives") return;
        primitivesImport = node;
        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportSpecifier" && "name" in specifier.imported) {
            imported.add(specifier.imported.name);
          }
        }
      },
      JSXOpeningElement(node: Rule.Node & { name?: { type?: string; name?: string } }) {
        const name = jsxName(node);
        if (name && JANUS_NAMES.has(name)) used.add(name);
      },
      "Program:exit"(node) {
        const missing = [...used].filter((name) => !imported.has(name)).sort();
        if (missing.length === 0) return;
        context.report({
          node,
          message: `Missing @janus/primitives import for ${missing.join(", ")}.`,
          fix(fixer) {
            const specifiers = (primitivesImport as { specifiers?: Rule.Node[] } | undefined)?.specifiers;
            const last = specifiers?.at(-1);
            if (last) {
              return fixer.insertTextAfter(last, `, ${missing.join(", ")}`);
            }
            const first = "body" in node ? (node.body as Rule.Node[])[0] : undefined;
            const statement = `import { ${missing.join(", ")} } from "@janus/primitives";\n`;
            return first ? fixer.insertTextBefore(first, statement) : fixer.insertTextAfter(node, statement);
          },
        });
      },
    };
  },
};

export const requireJanusImport: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Janus primitives must be imported from @janus/primitives." },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (typeof node.source.value !== "string") return;
        if (node.source.value.endsWith("/primitives") && node.source.value !== "@janus/primitives") {
          context.report({
            node,
            message: "Import primitives from @janus/primitives.",
          });
        }
      },
    };
  },
};

export const noDocumentPrimitives: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Forbid document-level Janus primitives." },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node: Rule.Node & { name?: { type?: string; name?: string } }) {
        const name = jsxName(node);
        if (name && DOCUMENT_PRIMITIVES.has(name)) {
          context.report({
            node,
            message: `<${name}> is a document-level element and is forbidden.`,
          });
        }
      },
    };
  },
};

export const singlePurpose: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: { description: "Prefer one component per file." },
    schema: [],
  },
  create(context) {
    if (isInternalPackage(context.filename)) return {};
    let count = 0;
    return {
      FunctionDeclaration(node) {
        if (node.id?.name && /^[A-Z]/.test(node.id.name)) {
          count += 1;
          if (count > 1) {
            context.report({
              node,
              message: "This file exports more than one component. Split it into single-purpose layers.",
            });
          }
        }
      },
    };
  },
};
