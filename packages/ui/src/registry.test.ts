import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(join(here, "registry.json"), "utf8")) as {
  wave1: string[];
  wave2: string[];
  wave3: string[];
  exceptions: Array<{ name: string }>;
};

describe("ui registry", () => {
  it("has source files for every wave 1 and wave 2 name", () => {
    for (const name of [...registry.wave1, ...registry.wave2]) {
      expect(existsSync(join(here, `${name}.tsx`)), `${name}.tsx`).toBe(true);
    }
  });

  it("lists wave 3 as exceptions instead of pretending they are shipped", () => {
    expect(registry.wave3).toEqual(expect.arrayContaining(["chart", "table", "calendar", "sidebar"]));
    expect(registry.exceptions.length).toBeGreaterThan(0);
  });
});
