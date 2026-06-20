# Example application

The repository includes [`examples/typescript`](https://github.com/erkez/packer/tree/master/examples/typescript) — a React + TypeScript app that serves as both an integration test and a copyable starter.

## What it exercises

| Feature | How |
|---------|-----|
| TypeScript + TSX | `src/index.tsx`, `src/App.tsx`, `ts-loader`, ForkTsChecker |
| React + hooks | `useState` in `App.tsx` |
| SCSS + CSS extract | `index.scss`, `App.scss` |
| Static assets | SVG import via webpack `asset/resource` |
| `@root` alias | `@root/App`, `@root/assets/logo.svg` |
| ESLint flat config | `recommended` + `typescript` overlays |
| HTML template | `public/index.html` |
| Production build | `build:prod` in CI |

Not covered: custom `publicPath`, dev-server proxy, library/UMD builds — see [Configuration](/docs/guides/configuration).

## Run inside the monorepo

From the repository root:

```sh
nvm use
yarn install
yarn workspace my-app start
yarn workspace my-app lint
yarn workspace my-app build:prod
```

## Use as a starter template

1. Copy `examples/typescript` outside the monorepo.
2. In `package.json`, replace the workspace dependency:

```json
"devDependencies": {
    "@ekz/packer": "beta",
    "typescript": "^6.0.3"
}
```

3. In `tsconfig.json`, set `extends` to `./node_modules/@ekz/packer/tsconfig/recommended.json` and add `@root` paths (see [ESLint](/docs/getting-started/eslint#typescript-project-config)).
4. Run `nvm use`, `yarn install`, and `yarn start`.

## Included files

| File | Purpose |
|------|---------|
| `webpack.config.js` | `createApplicationConfiguration()` with custom HTML template |
| `eslint.config.js` | Flat config from `@ekz/packer/recommended` and `/typescript` |
| `tsconfig.json` | Extends `@ekz/packer/tsconfig/recommended` |
| `src/` | TSX entry, component, SCSS, static asset |
| `public/` | HTML template for `html-webpack-plugin` |
