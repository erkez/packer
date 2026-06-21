---
"@ekz/packer": minor
---

Add `tsconfigPath` option to point Packer at a non-root `tsconfig.json`, so `.tsx` is transpiled with `ts-loader` instead of Babel. Document the production `jsxDEV` pitfall when TypeScript config is not found, and expand dev-server v5 migration notes.
