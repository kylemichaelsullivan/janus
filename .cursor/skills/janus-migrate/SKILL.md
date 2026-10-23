---
name: janus-migrate
description: Convert an existing React or Expo app to Janus. Use when the user asks to migrate, convert, or adopt Janus in an existing codebase, or after `janus migrate` prints residuals.
---

# janus migrate

Run the CLI. Do not hand-rename HTML tags.

```bash
janus migrate --dry-run
janus migrate --write
```

`--dry-run` is the default. `--write` requires a clean git tree unless `--force`. Next, CRA, webpack, and bare React Native are refused.

## After the script

Walk the residual report in this order:

1. Host refusals — stop. Move the app to Vite or Expo first.
2. Catalog imports — `janus add <name>` and re-compose. Do not paste Radix, Base UI, or MUI source.
3. `Platform.OS` / `react-native` — move into `*.ios.tsx` / `*.android.tsx` / `*.native.tsx`.
4. CSS-in-JS — rewrite to `className` via `@janus/style`.
5. God-components — one layer, one job.
6. Axe (web) or RNTL a11y (native) on every touched layer.

Finish with `janus doctor`. Facts: `packages/core/src/mapping.json`, `packages/ui/src/registry.json`.
