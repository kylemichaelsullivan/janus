import {
  missingPrimitiveImport,
  noDocumentPrimitives,
  noPlatformApi,
  noRawHtml,
  noRawRn,
  requireJanusImport,
  singlePurpose,
} from "./rules.js";

const plugin = {
  meta: { name: "eslint-plugin-janus", version: "0.0.0-dev" },
  rules: {
    "no-raw-html": noRawHtml,
    "no-raw-rn": noRawRn,
    "no-platform-api": noPlatformApi,
    "require-janus-import": requireJanusImport,
    "missing-primitive-import": missingPrimitiveImport,
    "no-document-primitives": noDocumentPrimitives,
    "single-purpose": singlePurpose,
  },
  configs: {
    recommended: {
      plugins: { janus: {} as unknown },
      rules: {
        "janus/no-raw-html": "error",
        "janus/no-raw-rn": "error",
        "janus/no-platform-api": "error",
        "janus/require-janus-import": "error",
        "janus/missing-primitive-import": "error",
        "janus/no-document-primitives": "error",
        "janus/single-purpose": "warn",
      },
    },
  },
};

plugin.configs.recommended.plugins = { janus: plugin };

export default plugin;
