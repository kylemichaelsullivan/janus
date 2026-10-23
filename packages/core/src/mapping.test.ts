import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ariaMap, mapAriaToNative } from "./a11y.js";
import { clearClassNameCache, mergeClassName } from "./classname.js";
import { inputNativeFor, inputTypeMap } from "./input-types.js";
import {
  allowedEntries,
  forbiddenNames,
  getEntry,
  getEntryByWhatwg,
  htmlIntrinsics,
  janusComponentNames,
  mapping,
} from "./mapping.js";
import { getRuntimePlatform } from "./platform.js";
import {
  assertNoCrossFamily,
  familyFor,
  isWebPlatform,
  overrideCandidates,
  pickOverride,
  splitPlatformSuffix,
  stripSourceExtension,
} from "./resolve-override.js";

describe("mapping table", () => {
  it("covers every WHATWG entry exactly once", () => {
    const names = mapping.map((entry) => entry.janus);
    expect(new Set(names).size).toBe(names.length);
    const tags = mapping.map((entry) => entry.whatwg);
    expect(new Set(tags).size).toBe(tags.length);
    expect(mapping.length).toBeGreaterThan(100);
  });

  it("resolves Janus and WHATWG lookups", () => {
    expect(getEntry("H1")?.web).toBe("h1");
    expect(getEntry("H1")?.native).toBe("Text");
    expect(getEntryByWhatwg("DIV")?.janus).toBe("Div");
    expect(getEntry("NotATag")).toBeUndefined();
    expect(getEntryByWhatwg("not-a-tag")).toBeUndefined();
  });

  it("separates forbidden document elements", () => {
    expect(forbiddenNames()).toEqual(
      expect.arrayContaining(["Html", "Head", "Body", "Script", "Style", "Meta", "Link", "Title"]),
    );
    expect(janusComponentNames()).not.toContain("Html");
    expect(allowedEntries().every((entry) => entry.status !== "forbidden")).toBe(true);
    expect(htmlIntrinsics()).toContain("h1");
  });

  it("flags every entry with web, native, and status", () => {
    for (const entry of mapping) {
      expect(entry.janus).toBeTruthy();
      expect(entry.whatwg).toBeTruthy();
      expect(entry.web).toBeTruthy();
      expect(entry.native).toBeTruthy();
      expect(["ok", "degraded", "stub", "forbidden"]).toContain(entry.status);
    }
  });
});

describe("aria map", () => {
  it("maps known ARIA fields and records drops", () => {
    const mapped = mapAriaToNative(
      {
        role: "button",
        "aria-label": "Save",
        "aria-labelledby": "lbl",
        "aria-describedby": "hint",
        "aria-hidden": true,
        "aria-disabled": "true",
        "aria-checked": "mixed",
        "aria-selected": true,
        "aria-expanded": false,
        "aria-busy": true,
        "aria-valuemin": 0,
        "aria-valuemax": 10,
        "aria-valuenow": 4,
        "aria-valuetext": "four",
        "aria-live": "polite",
        tabIndex: 0,
        htmlFor: "email",
      },
      "header",
    );
    expect(mapped.accessibilityRole).toBe("button");
    expect(mapped.accessibilityLabel).toBe("Save");
    expect(mapped.accessibilityLabelledBy).toBe("lbl");
    expect(mapped.accessibilityHint).toBe("hint");
    expect(mapped.importantForAccessibility).toBe("no-hide-descendants");
    expect(mapped.accessibilityState).toEqual({
      disabled: true,
      checked: "mixed",
      selected: true,
      expanded: false,
      busy: true,
    });
    expect(mapped.accessibilityValue).toEqual({ min: 0, max: 10, now: 4, text: "four" });
    expect(mapped.accessibilityLiveRegion).toBe("polite");
    expect(mapped.nativeID).toBe("email");
    expect(mapped.dropped).toContain("tabIndex");
    expect(ariaMap.length).toBeGreaterThan(10);
  });

  it("uses fallback role and boolean aria-hidden", () => {
    expect(mapAriaToNative({}, "header").accessibilityRole).toBe("header");
    expect(mapAriaToNative({ "aria-hidden": "true" }).importantForAccessibility).toBe(
      "no-hide-descendants",
    );
    expect(mapAriaToNative({ "aria-checked": true }).accessibilityState?.checked).toBe(true);
    expect(mapAriaToNative({ "aria-live": "assertive" }).accessibilityLiveRegion).toBe("assertive");
    expect(mapAriaToNative({ "aria-live": "none" }).accessibilityLiveRegion).toBe("none");
    expect(mapAriaToNative({ "aria-live": "nope" }).accessibilityLiveRegion).toBeUndefined();
  });
});

describe("className merge", () => {
  it("caches merged names and evicts", () => {
    clearClassNameCache();
    expect(mergeClassName("H1")).toBe("H1");
    expect(mergeClassName("H1", "text-xl")).toBe("H1 text-xl");
    expect(mergeClassName("H1", "text-xl")).toBe("H1 text-xl");
    for (let i = 0; i < 520; i += 1) {
      mergeClassName("H1", `c${i}`);
    }
    expect(mergeClassName("H1", "fresh")).toBe("H1 fresh");
    clearClassNameCache();
    expect(mergeClassName("P")).toBe("P");
  });
});

describe("platform", () => {
  it("defaults to web in jsdom", () => {
    const previous = process.env.JANUS_PLATFORM;
    delete process.env.JANUS_PLATFORM;
    expect(getRuntimePlatform()).toBe("web");
    process.env.JANUS_PLATFORM = "native";
    expect(getRuntimePlatform()).toBe("native");
    process.env.JANUS_PLATFORM = "web";
    expect(getRuntimePlatform()).toBe("web");
    if (previous === undefined) delete process.env.JANUS_PLATFORM;
    else process.env.JANUS_PLATFORM = previous;
  });
});

describe("override resolver", () => {
  it("orders ios families most-specific first", () => {
    expect(overrideCandidates("Hero.tsx", "ios")).toEqual([
      "Hero.ios.tsx",
      "Hero.apple.tsx",
      "Hero.native.tsx",
      "Hero.tsx",
    ]);
    expect(overrideCandidates("Hero", "web")).toEqual(["Hero.web", "Hero"]);
    expect(overrideCandidates("Hero.ts", "android")).toEqual([
      "Hero.android.ts",
      "Hero.native.ts",
      "Hero.ts",
    ]);
    expect(familyFor("unknown-os")).toEqual(["unknown-os", "native"]);
    expect(isWebPlatform("web")).toBe(true);
    expect(isWebPlatform("ios")).toBe(false);
  });

  it("picks the first existing candidate", () => {
    expect(pickOverride(["Hero.native.tsx", "Hero.tsx"], "Hero.tsx", "ios")).toBe("Hero.native.tsx");
    expect(pickOverride(["Hero.tsx"], "Hero.tsx", "web")).toBe("Hero.tsx");
    expect(pickOverride([], "Hero.tsx", "ios")).toBeUndefined();
  });

  it("rejects cross-family files", () => {
    expect(assertNoCrossFamily("Hero.native.tsx", "web").ok).toBe(false);
    expect(assertNoCrossFamily("Hero.web.tsx", "ios").ok).toBe(false);
    expect(assertNoCrossFamily("Hero.tsx", "ios").ok).toBe(true);
    expect(assertNoCrossFamily("Hero.ios.tsx", "ios").ok).toBe(true);
    expect(splitPlatformSuffix("Hero.ios").platform).toBe("ios");
    expect(stripSourceExtension("Hero").ext).toBe("");
  });
});

describe("input types", () => {
  it("maps known and unknown types", () => {
    expect(inputNativeFor("checkbox").native).toBe("Checkbox");
    expect(inputNativeFor("mystery").type).toBe("text");
    expect(inputTypeMap.some((entry) => entry.status === "stub")).toBe(true);
  });
});

describe("mapping docs", () => {
  it("lists every Janus name from the mapping table", () => {
    const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
    const docs = readFileSync(join(root, "docs/mapping.md"), "utf8");
    for (const entry of mapping) {
      expect(docs).toContain(`\`${entry.janus}\``);
    }
  });
});
