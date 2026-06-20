---
name: eslint-config-packer
description: >-
  Edit @ekz/eslint-config-packer flat configs and consumer eslint.config.js.
  Use when changing recommended.js, typescript.js, ESLint plugins, or lint
  behaviour for @ekz/packer apps.
---

# ESLint config packer

Read the source before editing — this skill only records non-obvious constraints.

| Consumer import | Implementation |
|-----------------|----------------|
| `@ekz/packer/recommended` | `packages/packer/config/eslint/recommended.js` → `packages/eslint-config-packer/recommended.js` |
| `@ekz/packer/typescript` | `packages/packer/config/eslint/typescript.js` → `packages/eslint-config-packer/typescript.js` |

Configs are **CommonJS arrays** exported from `recommended.js` / `typescript.js`. Consumers spread them in `eslint.config.js`. Consumer migration docs live in `packages/packer/README.md`.

## Invariants

- **Flat config only** — no `.eslintrc`; lint with `npx eslint .`
- **Classic hooks rules only** — do not use `reactHooks.configs.flat.recommended` (v7 adds React Compiler rules). Keep `rules-of-hooks` + `exhaustive-deps` explicitly.
- **Scope TypeScript rules** — every block from `typescript.js` must target `**/*.{ts,tsx}` only, or `@typescript-eslint/no-require-imports` breaks `.js` config files.
- **Prettier via ESLint** — formatting runs through `eslint-plugin-prettier`, not a separate formatter on save.

## Temporary: ESLint 10 + eslint-plugin-react

`eslint-plugin-react@7` still uses removed ESLint context APIs. Until upstream fixes land, wrap the plugin with `@eslint/compat` `fixupPluginRules()` in `recommended.js`. Re-check whether this is still needed after major eslint-plugin-react upgrades.

## Temporary: JSX in `.js` files

`@babel/eslint-parser` 8 needs `babelOptions.parserOpts.plugins: ['jsx']` for JSX in `.js` files (see `recommended.js`). Test with `examples/typescript/src/index.js`.

## Verify

```sh
yarn workspace @ekz/packer lint
yarn workspace my-app lint
```
