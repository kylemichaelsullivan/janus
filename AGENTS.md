# Janus agent contract

Use `@janus/primitives`. Never write raw HTML or raw React Native primitives in app source.

One layer, one job. Compose upward. Do not add props to a god-component.

Put platform APIs only in `*.ios.tsx`, `*.android.tsx`, `*.native.tsx`, or `*.web.tsx`. Folder slots (`Hero/Header.ios.tsx`) are the partial-override mechanism.

Import ShadCN-shaped UI from `@janus/ui` or `janus add`. Never import Radix or Base UI in app code.

Write an Axe test (web) or RNTL a11y test (native) in the same change as the layer.

After Metro, Vite, or Babel edits, run `janus doctor` and `vp check`.

Facts live in `packages/core/src/mapping.json` and `packages/ui/src/registry.json`. Procedures live in `.cursor/skills/`. Law lives in `.cursor/rules/`.
