export {
  migrateSource,
  type MigrateFileResult,
  type Residual,
  type ResidualKind,
  type TagChange,
} from "./migrate.js";
export { JanusTransformError, type Diagnostic, type DiagnosticSeverity } from "./diagnostics.js";
export { emitPlatformTrees, type EmitFile, type EmitOptions, type EmittedTree } from "./emit.js";
export { rewriteFor, type RewriteKind } from "./native-target.js";
export { default, default as janusPlugin, type PluginOptions } from "./plugin.js";
export { transformSource, transformSourceSafe, type TransformOptions, type TransformResult } from "./transform.js";
