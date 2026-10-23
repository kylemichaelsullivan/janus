# Overrides

Most-specific file wins. Web never receives a `*.native.*` module.

| Platform | Candidate order |
| --- | --- |
| iOS | `.ios` → `.apple` → `.native` → base |
| Android | `.android` → `.native` → base |
| Web | `.web` → base |

## Folder slots

Partial overrides are folders, not merged named exports.

```
Hero/index.tsx
Hero/Header.tsx
Hero/Header.ios.tsx
```

`Hero/Header.ios.tsx` replaces only that slot on iOS. Intra-file export merging is rejected.

## Expo Router

Files under `app/` need a non-platform sibling. Deep links must stay universal. Extra platforms that Expo Router does not treat as route variants live outside `app/` and are re-exported from the universal route file.
