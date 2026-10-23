import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const version = process.argv[2];
if (!version) {
  console.error("Usage: node scripts/set-version.mjs <version>");
  process.exit(1);
}

const packagesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "packages");
for (const name of readdirSync(packagesDir)) {
  const pkgPath = join(packagesDir, name, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.version = version;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}
