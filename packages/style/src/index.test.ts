import { describe, expect, it } from "vitest";
import { cn, nativewindInterop, useJanusClassName } from "./index.js";

describe("cn", () => {
  it("merges tailwind conflicts and caches", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(useJanusClassName("H1", "text-xl")).toContain("H1");
    nativewindInterop({});
    for (let i = 0; i < 260; i += 1) cn(`gap-${i}`);
    expect(cn("ok")).toBe("ok");
  });
});
