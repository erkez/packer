---
sidebar_position: 3
---

# Vite

If you are moving an existing app from Webpack, start with [Migrating from Webpack to Vite](/docs/migration/from-webpack-to-vite).

Create `vite.config.js` in your application root:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration();
```

This enables:

- React support via `@vitejs/plugin-react`
- `@root` alias to `./src`
- `vite-plugin-checker` for TypeScript typechecking when a TypeScript config is found — same as Webpack's ForkTsChecker
- SCSS and CSS through Vite
- Static assets through Vite
- Dev server on port **9000**
- Production builds through Vite/Rollup

## HTML entry

Vite uses `index.html` as the application entry. Add the module script yourself:

```html
<div id="root"></div>
<script type="module" src="/src/index.tsx"></script>
```

## Custom entry

The default entry is `index.html`. Override it when needed:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    entry: 'app.html'
});
```

## TypeScript config location

Packer looks for `tsconfig.json` in the application root (`INIT_CWD`). When found, `vite-plugin-checker` typechecks `.ts`/`.tsx` files against it, matching the same behavior as [Webpack](/docs/getting-started/webpack#typescript-config-location).

Typechecking adds no runtime/bundle cost — it's build/dev-time only, and does not slow down the dev server (checking runs in a background worker; HMR is unaffected). It does add real time to `vite build`, roughly proportional to your TypeScript program size, and fails the build on type errors. Set `typecheck: false` to disable it. See [Vite configuration](/docs/guides/vite-configuration#typescript-typechecking) for measured numbers and details.

If your `tsconfig.json` lives elsewhere, point Packer at it:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    tsconfigPath: 'src/main/web/tsconfig.json'
});
```

## Linting

Vite builds do not run ESLint automatically. Keep a separate script:

```json
{
    "scripts": {
        "lint": "npx eslint .",
        "build:prod": "npx vite build",
        "start": "npx vite"
    }
}
```

See [Vite configuration](/docs/guides/vite-configuration) for defaults and [Example application](/docs/guides/example-app) for a copyable Vite app.
