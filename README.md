# Janus

Toolkit for hybrid Web + Native apps from a single component source.

Developers write ShadCN-style trees with HTML-named layers (`H1`, `P`, `Div`, `Button`). A compiler rewrites them to real HTML on web and React Native primitives on native.

**This is the working prototype toward `1.0.0`.** Package versions are `0.0.0-dev` until the first GitHub tag.

## Opinionated toolchain

- Vite+ / `pnpm` + Vitest for the monorepo and web
- Expo + Metro for native
- NativeWind-ready `className` via `@janus/style`
- Axe on web (WCAG 2.2 AA)

Unsupported: webpack, CRA, Next, CSS-in-JS, raw HTML, raw RN in app source.

## Packages

| Package | Role |
| --- | --- |
| `@janus/core` | Mapping table, a11y, override resolution |
| `@janus/primitives` | HTML-named layers |
| `@janus/compiler` | AST rewrite + emit |
| `@janus/metro` / `@janus/vite` | Bundler plugins |
| `@janus/headless` / `@janus/ui` | Dialog, tabs, ShadCN ports |
| `eslint-plugin-janus` | Policy |
| `janus` | CLI |
| `create-janus-app` | Scaffold |

## Commands

```bash
pnpm install
pnpm test
pnpm exec janus doctor
pnpm exec janus migrate --dry-run
```

Convert an existing Vite or Expo app with `janus migrate`. Residuals are agent work (`.cursor/skills/janus-migrate`).

Human docs: `docs/executive-summary.md`. Agent contract: `AGENTS.md`.
