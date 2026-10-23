import data from "./mapping.json" with { type: "json" };
import type { MappingEntry } from "./types.js";

export const mapping = data as MappingEntry[];

const byJanus = new Map(mapping.map((entry) => [entry.janus, entry]));
const byWhatwg = new Map(mapping.map((entry) => [entry.whatwg, entry]));

export function getEntry(janusName: string): MappingEntry | undefined {
  return byJanus.get(janusName);
}

export function getEntryByWhatwg(tag: string): MappingEntry | undefined {
  return byWhatwg.get(tag.toLowerCase());
}

export function allowedEntries(): MappingEntry[] {
  return mapping.filter((entry) => entry.status !== "forbidden");
}

export function forbiddenNames(): readonly string[] {
  return mapping.filter((entry) => entry.status === "forbidden").map((entry) => entry.janus);
}

export function htmlIntrinsics(): readonly string[] {
  return mapping.map((entry) => entry.whatwg);
}

export function janusComponentNames(): readonly string[] {
  return allowedEntries().map((entry) => entry.janus);
}

export type JanusTag = (typeof mapping)[number]["janus"];
