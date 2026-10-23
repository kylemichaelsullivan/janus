# CLI

```bash
pnpm create janus-app my-app
cd my-app
pnpm install
janus add button
janus doctor
janus migrate --dry-run
janus build
janus dev
```

`create-janus-app` writes an Expo-shaped tree (`app/`, `metro.config.js`, `@janus/react`). Vite+ web apps run `vp create` then `janus init`.

`janus doctor` fails when Metro is missing `withJanus`, or when `Dialog` is used without `JanusPortalHost`.

`janus migrate` rewrites raw HTML JSX to Janus primitives. Dry-run is the default; `--write` applies the codemod. See [Migrate](/migrate).

`janus build` emits `.janus/{web,native}/` from the compiler. Default watch stays virtual — do not commit `.janus/`.
