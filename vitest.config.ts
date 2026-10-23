import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@janus/core": `${root}/packages/core/src/index.ts`,
      "@janus/style": `${root}/packages/style/src/index.ts`,
      "@janus/compiler": `${root}/packages/compiler/src/index.ts`,
      "@janus/primitives": `${root}/packages/primitives/src/index.ts`,
      "@janus/headless": `${root}/packages/headless/src/index.ts`,
      "@janus/ui": `${root}/packages/ui/src/index.ts`,
      "@janus/metro": `${root}/packages/metro/src/index.ts`,
      "@janus/vite": `${root}/packages/vite/src/index.ts`,
      "@janus/router": `${root}/packages/router/src/index.ts`,
      "eslint-plugin-janus": `${root}/packages/eslint-plugin-janus/src/index.ts`,
      janus: `${root}/packages/cli/src/index.ts`,
    },
  },
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    include: ["packages/**/*.test.ts", "packages/**/*.test.tsx", "apps/kitchen-sink/src/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
