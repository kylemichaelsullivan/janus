import type { PluginObj, PluginPass } from "@babel/core";
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getEntry,
  htmlIntrinsics,
  mergeClassName,
} from "@janus/core";
import type { Diagnostic } from "./diagnostics.js";
import { rewriteFor } from "./native-target.js";

export interface PluginOptions {
  platform?: string;
  strict?: boolean;
  filename?: string;
  diagnostics?: Diagnostic[];
}

interface State extends PluginPass {
  opts: PluginOptions;
  janusBindings: Map<string, string>;
  janusNamespaces: Set<string>;
  diagnostics: Diagnostic[];
  rnImports: Set<string>;
  needsLink: boolean;
  needsCn: boolean;
}

const HTML_TAGS = new Set(htmlIntrinsics());
const PRIMITIVES = "@janus/primitives";

function attrName(attr: t.JSXAttribute | t.JSXSpreadAttribute): string | undefined {
  if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name)) return undefined;
  return attr.name.name;
}

function applyClassName(opening: t.JSXOpeningElement, semantic: string, state: State): void {
  const existing = opening.attributes.find(
    (attr): attr is t.JSXAttribute => attrName(attr) === "className",
  );
  if (!existing) {
    opening.attributes.unshift(
      t.jsxAttribute(t.jsxIdentifier("className"), t.stringLiteral(semantic)),
    );
    return;
  }
  if (t.isStringLiteral(existing.value)) {
    existing.value = t.stringLiteral(mergeClassName(semantic, existing.value.value));
    return;
  }
  if (t.isJSXExpressionContainer(existing.value) && !t.isJSXEmptyExpression(existing.value.expression)) {
    state.needsCn = true;
    existing.value.expression = t.callExpression(t.identifier("_janusCn"), [
      t.stringLiteral(semantic),
      existing.value.expression,
    ]);
  }
}

function renameJsx(path: NodePath<t.JSXOpeningElement>, name: string, parentName?: t.JSXIdentifier): void {
  path.node.name = t.jsxIdentifier(name);
  const parent = path.parent;
  if (t.isJSXElement(parent) && parent.closingElement && t.isJSXIdentifier(parent.closingElement.name)) {
    if (!parentName || parent.closingElement.name.name === parentName.name) {
      parent.closingElement.name = t.jsxIdentifier(name);
    }
  }
}

function locOf(node: t.Node): Pick<Diagnostic, "line" | "column"> {
  return {
    line: node.loc?.start.line,
    column: node.loc?.start.column,
  };
}

function resolveJanusName(name: t.JSXOpeningElement["name"], state: State): string | undefined {
  if (t.isJSXIdentifier(name)) {
    return state.janusBindings.get(name.name);
  }
  if (
    t.isJSXMemberExpression(name) &&
    t.isJSXIdentifier(name.object) &&
    t.isJSXIdentifier(name.property) &&
    state.janusNamespaces.has(name.object.name)
  ) {
    return name.property.name;
  }
  return undefined;
}

export default function janusPlugin(): PluginObj<State> {
  return {
    name: "babel-plugin-janus",
    pre() {
      this.janusBindings = new Map();
      this.janusNamespaces = new Set();
      this.diagnostics = this.opts.diagnostics ?? [];
      this.rnImports = new Set();
      this.needsLink = false;
      this.needsCn = false;
    },
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value !== PRIMITIVES) return;
        for (const specifier of path.node.specifiers) {
          if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
            this.janusBindings.set(specifier.local.name, specifier.imported.name);
          } else if (t.isImportNamespaceSpecifier(specifier)) {
            this.janusNamespaces.add(specifier.local.name);
          } else if (t.isImportDefaultSpecifier(specifier)) {
            this.janusNamespaces.add(specifier.local.name);
          }
        }
      },
      JSXOpeningElement(path) {
        const filename = this.opts.filename ?? this.filename ?? undefined;
        const inNodeModules = Boolean(filename?.includes("node_modules"));
        const platform = this.opts.platform ?? "web";
        const nameNode = path.node.name;
        const janusName = resolveJanusName(nameNode, this);

        if (!janusName && t.isJSXIdentifier(nameNode) && HTML_TAGS.has(nameNode.name) && !inNodeModules) {
          const diagnostic: Diagnostic = {
            severity: this.opts.strict === false ? "warning" : "error",
            message: `Raw HTML <${nameNode.name}> is forbidden. Use the Janus <${nameNode.name.charAt(0).toUpperCase()}${nameNode.name.slice(1)}> primitive.`,
            filename,
            ...locOf(path.node),
          };
          this.diagnostics.push(diagnostic);
          return;
        }

        if (!janusName) return;
        const entry = getEntry(janusName);
        if (!entry) return;
        if (entry.status === "forbidden") {
          this.diagnostics.push({
            severity: "error",
            message: `<${janusName}> is a document-level element and is forbidden.`,
            filename,
            ...locOf(path.node),
          });
          return;
        }
        if (entry.status === "stub") {
          this.diagnostics.push({
            severity: "warning",
            message: `<${janusName}> has no native equivalent${entry.notes ? ` — ${entry.notes}` : "."}`,
            filename,
            ...locOf(path.node),
          });
        }

        const rewrite = rewriteFor(platform, entry.web, entry.native);
        const previous = t.isJSXIdentifier(nameNode) ? nameNode : undefined;
        applyClassName(path.node, janusName, this);

        if (rewrite.kind === "html") {
          renameJsx(path, rewrite.name, previous);
          return;
        }
        if (rewrite.kind === "rn") {
          this.rnImports.add(rewrite.name);
          renameJsx(path, rewrite.name, previous);
          return;
        }
        if (rewrite.kind === "link") {
          this.needsLink = true;
          renameJsx(path, "Link", previous);
          return;
        }
        if (rewrite.kind === "newline") {
          if (path.parentPath?.isJSXElement()) {
            path.parentPath.replaceWith(t.jsxExpressionContainer(t.stringLiteral("\n")));
          }
        }
      },
      Program: {
        exit(path) {
          if (this.needsCn) {
            path.unshiftContainer(
              "body",
              t.importDeclaration(
                [t.importSpecifier(t.identifier("_janusCn"), t.identifier("mergeClassName"))],
                t.stringLiteral("@janus/core"),
              ),
            );
          }
          if (this.rnImports.size > 0) {
            path.unshiftContainer(
              "body",
              t.importDeclaration(
                [...this.rnImports].sort().map((name) => t.importSpecifier(t.identifier(name), t.identifier(name))),
                t.stringLiteral("react-native"),
              ),
            );
          }
          if (this.needsLink) {
            path.unshiftContainer(
              "body",
              t.importDeclaration(
                [t.importSpecifier(t.identifier("Link"), t.identifier("Link"))],
                t.stringLiteral("expo-router"),
              ),
            );
          }
        },
      },
    },
  };
}
