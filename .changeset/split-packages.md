---
'@ekz/packer-vite': minor
'@ekz/packer-webpack': minor
'@ekz/packer': minor
'@ekz/eslint-config-packer': patch
---

Publish each bundler's configuration as its own package: `@ekz/packer-vite` and `@ekz/packer-webpack`. `@ekz/packer` now depends on both and re-exports them, so its API, subpaths and ESLint/tsconfig exports are unchanged. An app that only uses Vite can install `@ekz/packer-vite` alone and skip the webpack toolchain — 42 packages instead of 831 in a fresh npm install. `@ekz/eslint-config-packer` now declares `prettier`, which its Prettier plugin needs, instead of relying on `@ekz/packer` to provide it. `postcss`, `postcss-loader`, `postcss-preset-env` and `cssnano` are no longer dependencies: nothing in the webpack configuration used them.
