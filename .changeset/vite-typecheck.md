---
"@ekz/packer": minor
---

Add automatic TypeScript typechecking to the Vite path via `vite-plugin-checker`, matching Webpack's `ForkTsCheckerWebpackPlugin` behavior. When a `tsconfig.json` is found (or pointed to via the new `tsconfigPath` option), `vite build` and the dev server now report type errors — previously Vite silently transpiled without checking types. Adds no bundle/runtime cost and doesn't block the dev server, but adds real time to `vite build`. Pass `typecheck: false` to opt out.
