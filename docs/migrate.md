# Migrate an existing app

`janus migrate` turns raw HTML in JSX into Janus primitives using the mapping table. It does not invert the compiler. It does not convert Next, CRA, webpack, or bare React Native.

```bash
janus migrate --dry-run
janus migrate --write
janus migrate --write --path src
```

Dry-run is the default. `--write` scaffolds missing `janus.config.json` / `AGENTS.md`, rewrites `.js` / `.jsx` / `.ts` / `.tsx` under `src` (or `--path`), and prints residuals.

Leave `index.html` alone. Document tags (`html`, `head`, `body`, `script`) stay in the HTML shell.

Residuals (Radix, CSS-in-JS, `Platform.OS`, `createElement("div")`, routers) need judgment. Follow `.cursor/skills/janus-migrate/SKILL.md`.
