---
name: janus-overrides
description: Split a layer into platform override files or folder slots.
---

# janus-overrides

Use `Component.web.tsx` / `Component.native.tsx` / `Component.ios.tsx` when behavior differs. Keep a non-platform `Component.tsx` sibling for routes. For a single slot, use `Component/Header.ios.tsx`. Never merge named exports from two files.
