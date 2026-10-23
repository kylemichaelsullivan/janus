#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { initProject } from "janus";

const target = process.argv[2] ?? "janus-app";
mkdirSync(join(target, "app"), { recursive: true });
writeFileSync(
  join(target, "package.json"),
  JSON.stringify(
    {
      name: target,
      private: true,
      type: "module",
      scripts: {
        start: "expo start",
        web: "vite",
        ios: "expo start --ios",
        android: "expo start --android",
        build: "janus build",
        doctor: "janus doctor",
      },
    },
    null,
    2,
  ),
);
writeFileSync(
  join(target, "app.json"),
  `${JSON.stringify(
    {
      expo: {
        name: target,
        slug: target,
        scheme: "janus",
        plugins: ["expo-router"],
      },
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  join(target, "metro.config.cjs"),
  `const { withJanus } = require("@janus/metro");\nmodule.exports = withJanus({ transformer: {}, resolver: {} });\n`,
);
writeFileSync(
  join(target, "app/_layout.tsx"),
  `import { JanusPortalHost } from "@janus/headless";\nimport { Slot } from "@janus/router";\n\nexport default function RootLayout() {\n  return (\n    <JanusPortalHost>\n      <Slot />\n    </JanusPortalHost>\n  );\n}\n`,
);
writeFileSync(
  join(target, "app/index.tsx"),
  `import { H1, Main, P } from "@janus/primitives";\n\nexport default function Home() {\n  return (\n    <Main>\n      <H1>Janus</H1>\n      <P>Write primitives. Never write raw HTML.</P>\n    </Main>\n  );\n}\n`,
);
initProject(target);
console.log(`Created ${target}. Next: cd ${target} && pnpm add @janus/primitives && janus doctor`);
