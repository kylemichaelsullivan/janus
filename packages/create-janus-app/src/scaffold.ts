import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initProject } from "janus";

const pkg = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8"),
) as { version: string };

export function scaffoldApp(target: string): string {
  const version = `^${pkg.version}`;
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
        dependencies: {
          "@janus/metro": version,
          "@janus/react": version,
          react: "^19.2.0",
          "react-dom": "^19.2.0",
        },
        devDependencies: {
          "@janus/vite": version,
          "eslint-plugin-janus": version,
          janus: version,
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
    join(target, "metro.config.js"),
    `import { withJanus } from "@janus/metro";\n\nexport default withJanus({ transformer: {}, resolver: {} });\n`,
  );
  writeFileSync(
    join(target, "app/_layout.tsx"),
    `import { JanusPortalHost, Slot } from "@janus/react";\n\nexport default function RootLayout() {\n  return (\n    <JanusPortalHost>\n      <Slot />\n    </JanusPortalHost>\n  );\n}\n`,
  );
  writeFileSync(
    join(target, "app/index.tsx"),
    `import { H1, Main, P } from "@janus/react";\n\nexport default function Home() {\n  return (\n    <Main>\n      <H1>Janus</H1>\n      <P>Write primitives. Never write raw HTML.</P>\n    </Main>\n  );\n}\n`,
  );
  initProject(target);
  return target;
}
