# @ekz/packer

## 1.0.1

### Patch Changes

- 36a06df: Publish with npm provenance attestations, so releases are verifiably built from this repository's GitHub Actions workflow. Also upgrades webpack, webpack-cli, and postcss-preset-env to their latest patch/minor releases.
- Updated dependencies [36a06df]
  - @ekz/eslint-config-packer@1.0.1

## 1.0.0

### Minor Changes

- ba75dfd: Add alpha Vite support alongside the existing Webpack API via `Packer.vite.createApplicationConfiguration()`. Includes Vite dependencies, a React + TypeScript Vite example app, Webpack-to-Vite migration guidance, expanded bundler-specific configuration docs, and refreshed Packer icon assets.
- 808001d: Add `tsconfigPath` option to point Packer at a non-root `tsconfig.json`, so `.tsx` is transpiled with `ts-loader` instead of Babel. Document the production `jsxDEV` pitfall when TypeScript config is not found, and expand dev-server v5 migration notes.
- 878d206: Promote Vite support out of alpha. It's now documented and presented as an equally supported bundler alongside Webpack — no API changes, just dropping the alpha caveat from the README, docs site, and examples now that it's been verified in a real application migration.
- b1301f7: Add automatic TypeScript typechecking to the Vite path via `vite-plugin-checker`, matching Webpack's `ForkTsCheckerWebpackPlugin` behavior. When a `tsconfig.json` is found (or pointed to via the new `tsconfigPath` option), `vite build` and the dev server now report type errors — previously Vite silently transpiled without checking types. Adds no bundle/runtime cost and doesn't block the dev server, but adds real time to `vite build`. Pass `typecheck: false` to opt out.

### Patch Changes

- 9a1c556: Fix npm publishing for Yarn workspaces: release now uses `yarn npm publish` so `@ekz/eslint-config-packer` is published as a semver range instead of the broken `workspace:^` protocol left by `changeset publish`.
- 659a473: ESLint flat config fixes for TypeScript React consumers:

  - Restore 0.16 behavior: turn off `react/prop-types` and `react/display-name` globally (not JS-only) after extending `@ekz/packer/recommended`.
  - Register `eslint-plugin-react-hooks` for `**/*.{js,jsx,mjs,cjs,ts,tsx}` so consumers can override `react-hooks/exhaustive-deps` with a rules-only block — no plugin redeclaration or `fixupPluginRules` wrapper required.

- e2dba47: Upgrade dependencies (Vite, webpack, ts-loader, ESLint/typescript-eslint, prettier, and others) to their latest patch/minor releases.
- da8f20e: Add an `import` condition to the package's `exports` map so `@ekz/packer` can be consumed from an ESM `vite.config.mjs`/`vite.config.ts` (e.g. `import Packer from '@ekz/packer'`). Previously only `require` was exported, so loading an ESM Vite config failed with `No known conditions for "." specifier in "@ekz/packer" package`.
- Updated dependencies [9a1c556]
- Updated dependencies [659a473]
- Updated dependencies [e2dba47]
  - @ekz/eslint-config-packer@1.0.0

## 1.0.0-beta.7

### Minor Changes

- b1301f7: Add automatic TypeScript typechecking to the Vite path via `vite-plugin-checker`, matching Webpack's `ForkTsCheckerWebpackPlugin` behavior. When a `tsconfig.json` is found (or pointed to via the new `tsconfigPath` option), `vite build` and the dev server now report type errors — previously Vite silently transpiled without checking types. Adds no bundle/runtime cost and doesn't block the dev server, but adds real time to `vite build`. Pass `typecheck: false` to opt out.

### Patch Changes

- @ekz/eslint-config-packer@1.0.0-beta.7

## 1.0.0-beta.6

### Minor Changes

- 878d206: Promote Vite support out of alpha. It's now documented and presented as an equally supported bundler alongside Webpack — no API changes, just dropping the alpha caveat from the README, docs site, and examples now that it's been verified in a real application migration.

### Patch Changes

- e2dba47: Upgrade dependencies (Vite, webpack, ts-loader, ESLint/typescript-eslint, prettier, and others) to their latest patch/minor releases.
- da8f20e: Add an `import` condition to the package's `exports` map so `@ekz/packer` can be consumed from an ESM `vite.config.mjs`/`vite.config.ts` (e.g. `import Packer from '@ekz/packer'`). Previously only `require` was exported, so loading an ESM Vite config failed with `No known conditions for "." specifier in "@ekz/packer" package`.
- Updated dependencies [e2dba47]
  - @ekz/eslint-config-packer@1.0.0-beta.6

## 1.0.0-beta.5

### Minor Changes

- ba75dfd: Add alpha Vite support alongside the existing Webpack API via `Packer.vite.createApplicationConfiguration()`. Includes Vite dependencies, a React + TypeScript Vite example app, Webpack-to-Vite migration guidance, expanded bundler-specific configuration docs, and refreshed Packer icon assets.

### Patch Changes

- @ekz/eslint-config-packer@1.0.0-beta.5

## 1.0.0-beta.4

### Minor Changes

- 808001d: Add `tsconfigPath` option to point Packer at a non-root `tsconfig.json`, so `.tsx` is transpiled with `ts-loader` instead of Babel. Document the production `jsxDEV` pitfall when TypeScript config is not found, and expand dev-server v5 migration notes.

### Patch Changes

- @ekz/eslint-config-packer@1.0.0-beta.4

## 1.0.0-beta.3

### Patch Changes

- 659a473: ESLint flat config fixes for TypeScript React consumers:

  - Restore 0.16 behavior: turn off `react/prop-types` and `react/display-name` globally (not JS-only) after extending `@ekz/packer/recommended`.
  - Register `eslint-plugin-react-hooks` for `**/*.{js,jsx,mjs,cjs,ts,tsx}` so consumers can override `react-hooks/exhaustive-deps` with a rules-only block — no plugin redeclaration or `fixupPluginRules` wrapper required.

- Updated dependencies [659a473]
  - @ekz/eslint-config-packer@1.0.0-beta.3

## 1.0.0-beta.2

### Patch Changes

- 9a1c556: Fix npm publishing for Yarn workspaces: release now uses `yarn npm publish` so `@ekz/eslint-config-packer` is published as a semver range instead of the broken `workspace:^` protocol left by `changeset publish`.
- Updated dependencies [9a1c556]
  - @ekz/eslint-config-packer@1.0.0-beta.2

## 1.0.0-beta.1

### Patch Changes

- Webpack build performance improvements:

  - Split TypeScript and JavaScript transpilation (`.ts`/`.tsx` via `ts-loader` only; `.js`/`.jsx` via Babel) to avoid double transpiling TypeScript sources
  - Enable webpack filesystem cache (`node_modules/.cache/webpack`)
  - Use faster dev source maps (`eval-cheap-module-source-map` by default)
  - Enable Babel loader disk cache
  - Lint changed modules only during development (`eslint-webpack-plugin`)
  - Pass explicit `configFile` to ForkTsCheckerWebpackPlugin
  - Exclude `node_modules` from JS/TS loader rules

- Updated dependencies
  - @ekz/eslint-config-packer@1.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- 0d18d78: Breaking release migrating from 0.16:

  - **@ekz/packer**: TypeScript source compiled to `dist/`, Node.js 24+, Babel 8, webpack toolchain updates
  - **ESLint**: flat config only (ESLint 10); remove `.eslintrc`, add `eslint.config.js` via `@ekz/packer/recommended` and `/typescript`
  - **@ekz/eslint-config-packer**: flat config modules replacing legacy JSON configs

  See `packages/packer/README.md` for consumer migration steps.

### Patch Changes

- Updated dependencies [0d18d78]
  - @ekz/eslint-config-packer@1.0.0-beta.0
