import { describe, expect, it } from "vitest";
import { assertUniversalSibling, routeOverrideCandidates, ROUTER_CONVENTION, Slot } from "./index.js";

describe("router conventions", () => {
  it("requires a universal sibling in app/", () => {
    expect(ROUTER_CONVENTION.requireUniversalSibling).toBe(true);
    expect(assertUniversalSibling(["settings.web.tsx"], "settings.tsx").ok).toBe(false);
    expect(assertUniversalSibling(["settings.tsx", "settings.web.tsx"], "settings.tsx").ok).toBe(true);
    expect(routeOverrideCandidates("settings.tsx", "ios")[0]).toBe("settings.ios.tsx");
    expect(Slot({ children: "home" })).toBe("home");
  });
});
