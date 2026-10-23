import { allowedEntries } from "@janus/core";
import { createPrimitive, type JanusPrimitiveProps } from "./create-primitive.js";

export type JanusComponent = ReturnType<typeof createPrimitive>;

export const catalog: Record<string, JanusComponent> = Object.fromEntries(
  allowedEntries().map((entry) => [entry.janus, createPrimitive(entry)]),
);

export type { JanusPrimitiveProps };
