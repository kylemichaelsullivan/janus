---
name: janus-a11y
description: Run Axe and RNTL accessibility checks for a new Janus layer.
---

# janus-a11y

Web: `vitest-axe` on the rendered layer; `@axe-core/playwright` on docs routes when E2E is enabled. Fail on serious/critical. Native: assert `accessibilityRole` / `accessibilityLabel`. Do not call axe-core on React Native trees.
