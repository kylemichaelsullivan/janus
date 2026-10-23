---
name: janus-debug-transform
description: Debug Janus Metro/Vite transforms, source maps, and plugin order.
---

# janus-debug-transform

Run `janus build` to emit `.janus/{web,native}/`. Source maps must open the original file. Plugin order for Expo: Expo → Janus → NativeWind. Run `janus doctor`. If Vite+ and Metro disagree, the compiler core is the source of truth — do not fork rewrite rules.
