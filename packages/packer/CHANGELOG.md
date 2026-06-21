# @ekz/packer

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
