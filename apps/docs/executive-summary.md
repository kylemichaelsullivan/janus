---
title: Executive summary
---

# Why Janus

Teams should not write a web UI and a native UI. They also should not ship `react-native-web` `View`s and call that the web. Janus compiles HTML-named, single-purpose layers into real semantic HTML on web and React Native primitives on native.

The first working prototype is `1.0.0`. There is no `0.x`. Later versions are GitHub Releases.

**In:** primitives, compiler (Metro + Vite+), overrides, lint, ShadCN waves 1–2, CLI, `@janus/react`, human docs, agent docs, Axe on web.

**Out:** Next, webpack, CRA, Tailwind 4 on native, tvOS/visionOS CI, Axe DevTools Mobile.

**Law:** one layer, one job; compose upward; no raw HTML; no raw RN in app source; Axe or RNTL in the same change; Vite+ for web/monorepo, Expo for native.
