import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type HostKind = "vite" | "expo" | "next" | "cra" | "webpack" | "bare-rn" | "unknown";

export interface HostDetection {
  kind: HostKind;
  ok: boolean;
  message: string;
}

function readPackage(cwd: string): Record<string, unknown> {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return {};
  try {
    return JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function depNames(pkg: Record<string, unknown>): Set<string> {
  const names = new Set<string>();
  for (const key of ["dependencies", "devDependencies", "peerDependencies"]) {
    const block = pkg[key];
    if (block && typeof block === "object") {
      for (const name of Object.keys(block as Record<string, unknown>)) names.add(name);
    }
  }
  return names;
}

function hasFile(cwd: string, names: string[]): boolean {
  return names.some((name) => existsSync(join(cwd, name)));
}

export function detectHost(cwd: string): HostDetection {
  const pkg = readPackage(cwd);
  const deps = depNames(pkg);
  const viteConfig = hasFile(cwd, ["vite.config.ts", "vite.config.js", "vite.config.mts"]);
  const metroConfig = hasFile(cwd, ["metro.config.js", "metro.config.cjs", "metro.config.ts"]);
  const expoConfig = hasFile(cwd, ["app.json", "app.config.ts", "app.config.js"]);
  const nextConfig = hasFile(cwd, ["next.config.js", "next.config.mjs", "next.config.ts"]);
  const webpackConfig = hasFile(cwd, ["webpack.config.js", "webpack.config.ts"]);

  if (deps.has("next") || nextConfig) {
    return {
      kind: "next",
      ok: false,
      message: "Next is unsupported. Move the UI to Vite or Expo first.",
    };
  }
  if (deps.has("react-scripts")) {
    return {
      kind: "cra",
      ok: false,
      message: "Create React App is unsupported. Move to Vite, then migrate.",
    };
  }
  if ((deps.has("webpack") || webpackConfig) && !deps.has("vite") && !viteConfig && !deps.has("expo")) {
    return {
      kind: "webpack",
      ok: false,
      message: "webpack is unsupported. Move to Vite or Expo first.",
    };
  }
  const hasExpo = deps.has("expo") || deps.has("expo-router") || expoConfig;
  if (deps.has("react-native") && !hasExpo && !metroConfig) {
    return {
      kind: "bare-rn",
      ok: false,
      message: "Bare React Native is unsupported. Use Expo.",
    };
  }
  if (deps.has("vite") || viteConfig) {
    return { kind: "vite", ok: true, message: "Vite+ host." };
  }
  if (hasExpo || metroConfig) {
    return { kind: "expo", ok: true, message: "Expo / Metro host." };
  }
  return {
    kind: "unknown",
    ok: false,
    message: "No Vite or Expo host found. Add vite.config.* or an Expo app, then retry.",
  };
}
