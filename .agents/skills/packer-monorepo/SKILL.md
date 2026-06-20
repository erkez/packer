---
name: packer-monorepo
description: >-
  Work in the @ekz/packer Yarn monorepo: workspace layout, library build,
  examples integration, and release conventions. Use when changing packages/*,
  examples/*, or root workspace config.
---

# Packer monorepo

## Layout

```
packages/packer/               @ekz/packer — TypeScript → dist/
packages/eslint-config-packer/ shared ESLint flat configs
examples/typescript/           my-app — integration test + copyable starter
```

Workspaces: `packages/*`, `examples/*`. One root `yarn.lock`.

## Library

- Source: `packages/packer/src/` · publish: `dist/` (`yarn build` / `prepare`)
- API: `Packer.webpack.createApplicationConfiguration()` / `createLibraryConfiguration()`
- Also exports `./recommended`, `./typescript`, `./tsconfig/*`
- Node `>=24` (`.nvmrc` in repo root and each example)

```sh
yarn workspace @ekz/packer build
yarn workspace @ekz/packer lint
yarn workspace my-app lint   # when webpack or eslint surface changes
```

## Examples

Dual purpose: `workspace:^` in-repo; users copy out and pin `"@ekz/packer": "^x.y.z"`. Details in `examples/typescript/README.md`.

Do not add nested `yarn.lock` or `bin/setup-node` — use `.nvmrc` + `nvm use`.

## Release

Bump `@ekz/packer` and `@ekz/eslint-config-packer` versions together. Consumer-facing changelog and migration notes go in `packages/packer/README.md`.

## Pitfalls

- Package scope is **`@ekz/*`**, not `@erkez/*`
- Do not force `@babel/core` via Yarn resolutions — Babel 7 from `eslint-plugin-react-hooks` as a transitive dep is acceptable
- `eslint-webpack-plugin@6` defaults to flat config — matches `eslint.config.js` consumers

For ESLint config specifics, see [eslint-config-packer](../eslint-config-packer/SKILL.md).
