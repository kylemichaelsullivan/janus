import { transformSync } from "@babel/core";
import { JanusTransformError, type Diagnostic } from "./diagnostics.js";
import janusPlugin, { type PluginOptions } from "./plugin.js";

export interface TransformOptions extends PluginOptions {
  platform: string;
  sourceMaps?: boolean;
}

export interface TransformResult {
  code: string;
  map?: object | null;
  diagnostics: Diagnostic[];
}

export function transformSource(source: string, options: TransformOptions): TransformResult {
  const diagnostics: Diagnostic[] = options.diagnostics ?? [];
  const result = transformSync(source, {
    filename: options.filename ?? "unknown.tsx",
    sourceMaps: options.sourceMaps ?? true,
    ast: false,
    code: true,
    configFile: false,
    babelrc: false,
    compact: false,
    plugins: [[janusPlugin, { ...options, diagnostics }]],
    parserOpts: {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    },
  });

  const errors = diagnostics.filter((item) => item.severity === "error");
  if (errors.length > 0 && options.strict !== false) {
    throw new JanusTransformError(errors);
  }

  return {
    code: result?.code ?? "",
    map: (result?.map as object | null | undefined) ?? null,
    diagnostics,
  };
}

export function transformSourceSafe(source: string, options: TransformOptions): TransformResult {
  try {
    return transformSource(source, options);
  } catch (error) {
    if (error instanceof JanusTransformError) {
      return { code: source, map: null, diagnostics: error.diagnostics };
    }
    throw error;
  }
}
