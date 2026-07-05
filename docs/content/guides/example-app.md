---
sidebar_position: 4
---

# Example application

The repository includes two React + TypeScript examples that serve as integration tests and copyable starters:

- [`examples/typescript`](https://github.com/erkez/packer/tree/master/examples/typescript) for Webpack
- [`examples/typescript-vite`](https://github.com/erkez/packer/tree/master/examples/typescript-vite) for Vite

## What it exercises

| Feature | How |
|---------|-----|
| TypeScript + TSX | `src/index.tsx`, `src/App.tsx`, Webpack `ts-loader`/ForkTsChecker or Vite/esbuild |
| React + hooks | `useState` in `App.tsx` |
| SCSS | `index.scss`, `App.scss` |
| Static assets | SVG import |
| `@root` alias | `@root/App`, `@root/assets/logo.svg` |
| ESLint flat config | `recommended` + `typescript` overlays |
| HTML | Webpack template or Vite `index.html` entry |
| Production build | `build:prod` in CI |

Not covered: custom `publicPath`, dev-server proxy, or library/UMD builds. See [Webpack configuration](/docs/guides/webpack-configuration) and [Vite configuration](/docs/guides/vite-configuration).

## Run inside the monorepo

From the repository root:

```sh
nvm use
yarn install
yarn workspace my-app start
yarn workspace my-app lint
yarn workspace my-app build:prod
yarn workspace my-vite-app start
yarn workspace my-vite-app lint
yarn workspace my-vite-app build:prod
```

## Use as a starter template

1. Copy `examples/typescript` or `examples/typescript-vite` outside the monorepo.
2. In `package.json`, replace the workspace dependency:

```json
"devDependencies": {
    "@ekz/packer": "^1.0.0",
    "typescript": "^6.0.3"
}
```

3. In `tsconfig.json`, set `extends` to `./node_modules/@ekz/packer/tsconfig/recommended.json` and add `@root` paths (see [ESLint](/docs/getting-started/eslint#typescript-project-config)).
4. Run `nvm use`, `yarn install`, and `yarn start`.

## Included files

| File | Purpose |
|------|---------|
| `webpack.config.js` | Webpack `createApplicationConfiguration()` with custom HTML template |
| `vite.config.js` | Vite `createApplicationConfiguration()` |
| `eslint.config.js` | Flat config from `@ekz/packer/recommended` and `/typescript` |
| `tsconfig.json` | Extends `@ekz/packer/tsconfig/recommended` |
| `src/` | TSX entry, component, SCSS, static asset |
| `public/` or `index.html` | Webpack HTML template or Vite HTML entry |
