---
name: janus-primitives
description: Choose the correct Janus HTML primitive and handle fallbacks.
---

# janus-primitives

Look up `packages/core/src/mapping.json`. Prefer `ok` status tags. `Iframe` is a WebView (degraded). `Table` is a View grid (degraded). `Canvas`, `Embed`, `Map`, `Area` are stubs — throw in development. Document-level tags (`Html`, `Head`, `Script`) are forbidden.
