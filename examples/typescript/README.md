# TypeScript + React example

A minimal React application that uses `@ekz/packer` for webpack, ESLint, and TypeScript configuration.

This folder serves two purposes:

- **In the monorepo** — integration test for `@ekz/packer` changes (lint, build, dev server).
- **Outside the repo** — starter template you can copy into your own project.

## Running inside the monorepo

From the repository root:

```sh
nvm use          # Node 24+, see .nvmrc in this directory or ../../.nvmrc at repo root
yarn install
yarn workspace my-app start
```

Other commands:

```sh
yarn workspace my-app lint
yarn workspace my-app build:prod
```

The example depends on `@ekz/packer` via `workspace:^`, so it always uses the local package under `packages/packer`.

## Using as a starter template

1. Copy this directory to where you want your app to live (do not copy it as a child of the packer monorepo).

2. In `package.json`, replace the workspace dependency with a published version:

```json
"devDependencies": {
    "@ekz/packer": "beta",
    "typescript": "^6.0.3"
}
```

Pin an exact beta if you prefer: `"@ekz/packer": "1.0.0-beta.0"`.

In `tsconfig.json`, change the `extends` path to `./node_modules/@ekz/packer/tsconfig/recommended.json` (the monorepo example uses `../../node_modules/...` because dependencies are hoisted to the repo root).

3. Install dependencies from the app root (this creates its own `yarn.lock` or `package-lock.json`):

```sh
nvm use          # uses .nvmrc in this directory (Node 24+)
yarn install
# or: npm install
```

4. Start developing:

```sh
yarn start
```

The config files (`webpack.config.js`, `eslint.config.js`, `tsconfig.json`) are ready to use as-is. Adjust `src/`, `public/`, and scripts in `package.json` for your app.

## What's included

| File | Purpose |
|------|---------|
| `webpack.config.js` | Webpack config via `Packer.webpack.createApplicationConfiguration()` |
| `eslint.config.js` | ESLint flat config from `@ekz/packer/recommended` and `/typescript` |
| `tsconfig.json` | TypeScript config extending `@ekz/packer/tsconfig/recommended` |
| `.nvmrc` | Node.js version for `nvm use` |
| `.vscode/` | Recommended extensions and editor settings (ESLint on save) |
| `src/` | Application source |
| `public/` | HTML template for `html-webpack-plugin` |

## Requirements

- Node.js **24+**
- `@ekz/packer` **1.0.0-beta** or later (when used outside the monorepo; use `@beta` until stable)

See the [main Packer README](../../packages/packer/README.md) for installation details and migration notes from 0.16.
