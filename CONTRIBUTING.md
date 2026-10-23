# Contributing

1. Use `@janus/primitives`. Do not land raw HTML or raw RN in app examples.
2. Mapping JSON is the only source of truth for tags.
3. Every web layer needs a `vitest-axe` case. Serious and critical violations fail CI.
4. Compiler and resolver changes require 100% coverage on those packages.
5. Convert existing Vite or Expo apps with `janus migrate`. Do not hand-rename tags.
6. Do not add Prettier, Turborepo, tsup, or a second mapping table.

The first working prototype is git tag `1.0.0`. Package versions stay `0.0.0-dev` until that tag is published.
