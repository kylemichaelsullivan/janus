# Recipe: settings screen with an iOS override

1. Create `src/components/Settings/index.tsx` with Janus primitives only.
2. Put iOS-only haptics in `src/components/Settings/Row.ios.tsx`.
3. Keep `app/settings.tsx` as `export { Settings as default } from "@/components/Settings"` so Expo Router has a universal sibling.
4. Add `vitest-axe` for the web tree.
