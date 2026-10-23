# Styling

`className` is the styling API. `@janus/style` wraps `clsx` + `tailwind-merge` with an LRU cache.

`1.0.0` uses NativeWind v4 and Tailwind 3, behind the `@janus/style` adapter. Uniwind and NativeWind v5 are post-`1.0.0`. Tailwind 4 on native is unsupported.

Do not use CSS-in-JS. Do not reach around the adapter to style React Native primitives in app source.

Descendant-only selectors are a native risk. Prefer class names on the layer you mean.
