---
sidebar_position: 3
---

# Vite

Vite support in `@ekz/packer` is currently **alpha**. The API may change before it is promoted to stable. If you are moving an existing app from Webpack, start with [Migrating from Webpack to Vite](/docs/migration/from-webpack-to-vite).

Create `vite.config.js` in your application root:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration();
```

This enables:

- React support via `@vitejs/plugin-react`
- `@root` alias to `./src`
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
