# Concepts

Janus is a compiler and a catalog, not a second React.

You write HTML-named layers (`H1`, `P`, `Div`, `Button`) from `@janus/primitives`. On web they become real semantic HTML. On native they become React Native primitives. The mapping table in `@janus/core` is the source of truth.

## Laws

1. One layer, one job. Compose upward. Do not grow a god-component.
2. No raw HTML and no raw React Native in app source.
3. Platform APIs live in override files, never in the universal layer.
4. Axe (web) or RNTL a11y (native) ships in the same change as the layer.
5. Vite+ is the web and monorepo toolchain. Expo + Metro is native. Janus does not write a router — Expo Router is the router.

## What Janus is not

Not Next. Not webpack. Not CRA. Not CSS-in-JS. Not `react-native-web` Views sold as HTML. Not a `0.x` experiment — the first working prototype is tagged `1.0.0`.
