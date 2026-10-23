export type DiagnosticSeverity = "error" | "warning";

export interface Diagnostic {
  severity: DiagnosticSeverity;
  message: string;
  filename?: string;
  line?: number;
  column?: number;
}

export class JanusTransformError extends Error {
  readonly diagnostics: Diagnostic[];

  constructor(diagnostics: Diagnostic[]) {
    const first = diagnostics[0]?.message ?? "Janus transform failed";
    super(first);
    this.name = "JanusTransformError";
    this.diagnostics = diagnostics;
  }
}
