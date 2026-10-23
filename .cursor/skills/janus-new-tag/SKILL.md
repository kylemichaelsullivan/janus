---
name: janus-new-tag
description: Add a WHATWG element to the Janus mapping table and regenerate types.
---

# janus-new-tag

1. Add a row to `packages/core/src/mapping.json`.
2. Export the primitive from `packages/primitives/src/index.ts`.
3. Add mapping unit tests.
4. Update compiler fixtures if the native target is new.
5. Do not hand-edit generated docs tables.
