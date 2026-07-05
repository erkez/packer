# React + TypeScript Vite example

A React application that exercises `@ekz/packer` Vite support: TypeScript/TSX, SCSS, static assets, ESLint flat config, and Vite dev/production builds.

This folder serves two purposes:

- **In the monorepo** — integration test for `@ekz/packer` Vite support.
- **Outside the repo** — starter template you can copy into your own project.

## What CI validates

| Feature | How |
|---------|-----|
| TypeScript + TSX | `src/index.tsx`, `src/App.tsx`, Vite/esbuild transpilation |
| React + hooks | `useState` in `App.tsx`; ESLint react-hooks rules |
| SCSS | `index.scss` (normalize.css), `App.scss` |
| Static assets | SVG import via Vite assets |
| `@root` alias | `@root/App`, `@root/assets/logo.svg` |
| ESLint flat config | `eslint.config.js` with recommended + typescript overlays |
| HTML entry | `index.html` with Vite module script |
| Production build | `build:prod` in CI |

## Running inside the monorepo

From the repository root:

```sh
nvm use
yarn install
yarn workspace my-vite-app start
```

Other commands:

```sh
yarn workspace my-vite-app lint
yarn workspace my-vite-app build:prod
```

The example depends on `@ekz/packer` via `workspace:^`, so it always uses the local package under `packages/packer`.

## Using as a starter template

1. Copy this directory to where you want your app to live (do not copy it as a child of the packer monorepo).

2. In `package.json`, replace the workspace dependency with a published version:

```json
"devDependencies": {
    "@ekz/packer": "^1.0.0",
    "typescript": "^6.0.3"
}
```

In `tsconfig.json`, change the `extends` path to `./node_modules/@ekz/packer/tsconfig/recommended.json` (the monorepo example uses `../../node_modules/...` because dependencies are hoisted to the repo root).

3. Install dependencies from the app root:

```sh
nvm use
yarn install
# or: npm install
```

4. Start developing:

```sh
yarn start
```

The config files (`vite.config.js`, `eslint.config.js`, `tsconfig.json`) are ready to use as-is. Adjust `src/`, `index.html`, and scripts in `package.json` for your app.

## What's included

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite config via `Packer.vite.createApplicationConfiguration()` |
| `eslint.config.js` | ESLint flat config from `@ekz/packer/recommended` and `/typescript` |
| `tsconfig.json` | TypeScript config extending `@ekz/packer/tsconfig/recommended` |
| `index.html` | Vite HTML entry |
| `src/` | TSX app entry, component, SCSS, and static asset |

## Requirements

- Node.js **24+**
- `@ekz/packer` **1.0.0** or later (when used outside the monorepo)
