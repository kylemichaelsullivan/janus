import type { AriaMapEntry } from "./types.js";

export const ariaMap: readonly AriaMapEntry[] = [
  { web: "role", native: "accessibilityRole" },
  { web: "aria-label", native: "accessibilityLabel" },
  {
    web: "aria-labelledby",
    native: "accessibilityLabelledBy",
    notes: "Android only; dropped on iOS.",
  },
  {
    web: "aria-describedby",
    native: "accessibilityHint",
    notes: "Best-effort mapping.",
  },
  { web: "aria-hidden", native: "importantForAccessibility" },
  { web: "aria-disabled", native: "accessibilityState.disabled" },
  { web: "aria-checked", native: "accessibilityState.checked" },
  { web: "aria-selected", native: "accessibilityState.selected" },
  { web: "aria-expanded", native: "accessibilityState.expanded" },
  { web: "aria-busy", native: "accessibilityState.busy" },
  { web: "aria-valuemin", native: "accessibilityValue.min" },
  { web: "aria-valuemax", native: "accessibilityValue.max" },
  { web: "aria-valuenow", native: "accessibilityValue.now" },
  { web: "aria-valuetext", native: "accessibilityValue.text" },
  { web: "aria-live", native: "accessibilityLiveRegion", notes: "Android only." },
  { web: "tabIndex", native: "dropped", notes: "Dropped on native." },
  { web: "htmlFor", native: "nativeID", notes: "Associate the labelled control." },
];

const STATE_KEYS = ["disabled", "checked", "selected", "expanded", "busy"] as const;
const VALUE_KEYS = ["min", "max", "now", "text"] as const;

export interface MappedA11y {
  accessibilityRole?: string;
  accessibilityLabel?: string;
  accessibilityLabelledBy?: string;
  accessibilityHint?: string;
  importantForAccessibility?: "yes" | "no" | "no-hide-descendants";
  accessibilityState?: {
    disabled?: boolean;
    checked?: boolean | "mixed";
    selected?: boolean;
    expanded?: boolean;
    busy?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityLiveRegion?: "none" | "polite" | "assertive";
  nativeID?: string;
  dropped: string[];
}

export function mapAriaToNative(
  props: Record<string, unknown>,
  fallbackRole?: string,
): MappedA11y {
  const dropped: string[] = [];
  const result: MappedA11y = { dropped };
  const state: NonNullable<MappedA11y["accessibilityState"]> = {};
  const value: NonNullable<MappedA11y["accessibilityValue"]> = {};

  const role = typeof props.role === "string" ? props.role : fallbackRole;
  if (role) result.accessibilityRole = role;

  if (typeof props["aria-label"] === "string") {
    result.accessibilityLabel = props["aria-label"];
  }
  if (typeof props["aria-labelledby"] === "string") {
    result.accessibilityLabelledBy = props["aria-labelledby"];
  }
  if (typeof props["aria-describedby"] === "string") {
    result.accessibilityHint = props["aria-describedby"];
  }
  if (props["aria-hidden"] === true || props["aria-hidden"] === "true") {
    result.importantForAccessibility = "no-hide-descendants";
  }
  if (props["aria-disabled"] === true || props["aria-disabled"] === "true") {
    state.disabled = true;
  }
  if (props["aria-checked"] !== undefined) {
    state.checked = props["aria-checked"] === "mixed" ? "mixed" : Boolean(props["aria-checked"]);
  }
  if (props["aria-selected"] !== undefined) state.selected = Boolean(props["aria-selected"]);
  if (props["aria-expanded"] !== undefined) state.expanded = Boolean(props["aria-expanded"]);
  if (props["aria-busy"] !== undefined) state.busy = Boolean(props["aria-busy"]);
  if (typeof props["aria-valuemin"] === "number") value.min = props["aria-valuemin"];
  if (typeof props["aria-valuemax"] === "number") value.max = props["aria-valuemax"];
  if (typeof props["aria-valuenow"] === "number") value.now = props["aria-valuenow"];
  if (typeof props["aria-valuetext"] === "string") value.text = props["aria-valuetext"];
  if (props["aria-live"] === "polite" || props["aria-live"] === "assertive" || props["aria-live"] === "none") {
    result.accessibilityLiveRegion = props["aria-live"];
  }
  if (props.tabIndex !== undefined) dropped.push("tabIndex");
  if (typeof props.htmlFor === "string") result.nativeID = props.htmlFor;

  if (STATE_KEYS.some((key) => state[key] !== undefined)) {
    result.accessibilityState = state;
  }
  if (VALUE_KEYS.some((key) => value[key] !== undefined)) {
    result.accessibilityValue = value;
  }

  return result;
}

export const WEB_ARIA_PROP_NAMES = [
  "role",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-hidden",
  "aria-disabled",
  "aria-checked",
  "aria-selected",
  "aria-expanded",
  "aria-busy",
  "aria-valuemin",
  "aria-valuemax",
  "aria-valuenow",
  "aria-valuetext",
  "aria-live",
  "tabIndex",
  "htmlFor",
] as const;
