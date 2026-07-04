---
"@ekz/packer": patch
---

Add an `import` condition to the package's `exports` map so `@ekz/packer` can be consumed from an ESM `vite.config.mjs`/`vite.config.ts` (e.g. `import Packer from '@ekz/packer'`). Previously only `require` was exported, so loading an ESM Vite config failed with `No known conditions for "." specifier in "@ekz/packer" package`.
