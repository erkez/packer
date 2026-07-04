---
sidebar_position: 2
---

# Migrating from Webpack to Vite

Treat the migration as an application-level change: keep the Webpack build working until the Vite build, lint, and local development flow are verified.

## Quick checklist

1. Add `vite.config.js`.
2. Move the HTML entry from `public/index.html` to `index.html`.
3. Add the Vite module script to `index.html`.
4. Update package scripts from `webpack` / `webpack-dev-server` to `vite`.
5. Replace Webpack-only imports or conventions.
6. Verify aliases, static assets, environment variables, and proxy config.
7. Run both builds once, then remove the old Webpack config when Vite is stable for your app.

## 1. Add Vite config

Create `vite.config.js`:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration();
```

If your Webpack config sets `output.publicPath`, use Vite's `base` option:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    base: '/my-app/'
});
```

See [Vite configuration](/docs/guides/vite-configuration) for the full option surface.

## 2. Move the HTML entry

Webpack usually uses `public/index.html` through `html-webpack-plugin`:

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    html: {
        template: 'public/index.html',
        filename: 'index.html'
    }
});
```

Vite uses `index.html` as an application entry. Move or copy `public/index.html` to the app root and add a module script:

```html
<div id="root"></div>
<script type="module" src="/src/index.tsx"></script>
```

If your HTML file has another name, set `entry` in `vite.config.js`.

## 3. Update scripts

Replace Webpack scripts:

```json
{
    "scripts": {
        "build:dev": "npx webpack --mode=development",
        "build:prod": "npx webpack --mode=production",
        "build:watch": "npx webpack-dev-server --mode=development",
        "start": "yarn build:watch"
    }
}
```

with Vite scripts:

```json
{
    "scripts": {
        "build": "yarn build:prod",
        "build:dev": "npx vite build --mode development",
        "build:prod": "npx vite build",
        "preview": "npx vite preview",
        "start": "npx vite"
    }
}
```

Keep linting separate. Vite builds do not run ESLint automatically:

```json
{
    "scripts": {
        "lint": "npx eslint ."
    }
}
```

## 4. Translate common options

| Webpack option | Vite equivalent |
|----------------|-----------------|
| `entry: { main: './src/index.tsx' }` | Add `<script type=\"module\" src=\"/src/index.tsx\"></script>` to `index.html` |
| `output.path: 'dist'` | `outDir: 'dist'` |
| `output.publicPath: '/my-app/'` | `base: '/my-app/'` |
| `assetPaths` | `assetPaths` |
| `useHashInFileNames` | `useHashInFileNames` |
| `resolve.alias` | `resolve.alias` |
| `devServer.port` | `server.port` |
| `devServer.proxy` | `server.proxy` |
| `define` | Native Vite `define` |
| `plugins` | Vite `plugins` |

Webpack-only options such as `loaders`, `babelOptions`, `splitChunks`, `terserOptions`, `miniCssExtractPluginOptions`, `html`, and `tsconfigPath` do not carry over directly. Use native Vite or Rollup options where needed.

## 5. Check source compatibility

Most React + TypeScript source code should carry over unchanged. Look for Webpack-specific behavior:

- Replace `~package/path` CSS imports with normal package imports, for example `@import 'normalize.css/normalize.css';`.
- Replace `require.context` with explicit imports or `import.meta.glob`.
- Move compile-time constants from Webpack `DefinePlugin` to Vite `define`.
- Replace `process.env.*` client usage with Vite env variables when appropriate.
- Keep `@root/*` in `tsconfig.json` paths; Packer's Vite config sets the same `@root` alias.

## 6. Verify before removing Webpack

Run the old and new builds during migration:

```sh
yarn lint
yarn build:prod          # Webpack, before script changes
npx vite build           # Vite
npx vite                 # local dev server
```

Once the Vite app works locally and in CI, remove `webpack.config.js` and the old Webpack scripts for that application.
