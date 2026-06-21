---
sidebar_position: 1
---

# Migrating from 0.16

1.0.0 is a breaking release. The last published stable version used `.eslintrc` and shipped JavaScript from `src/`. This release:

- Is written in TypeScript and ships compiled output from `dist/`
- Requires Node.js **24+**
- Uses ESLint **10** flat config only

Install the beta while 1.0 is in pre-release:

```sh
yarn add -D @ekz/packer@beta
```

## ESLint

1. Delete `.eslintrc`
2. Add `eslint.config.js` — see [ESLint setup](/docs/getting-started/eslint)
3. Update your lint script to `"lint": "npx eslint ."`

## Node.js

Requires Node.js 24 or later. Add an `.nvmrc` (for example `v24.17`) and run `nvm use`.

## Webpack

The public API is unchanged:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

If you customized webpack via Packer options, review [Webpack configuration](/docs/guides/webpack-configuration) — defaults may have changed with dependency upgrades.

**TypeScript config location**

Packer looks for `tsconfig.json` at the app root. If yours lives in a subdirectory (for example `src/main/web/tsconfig.json`), either add a root config or set `tsconfigPath`:

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    tsconfigPath: 'src/main/web/tsconfig.json'
});
```

Without a discoverable TypeScript config, `.tsx` is transpiled by Babel instead of `ts-loader`. Babel can emit development-only `jsxDEV` calls that crash in production (`jsxDEV is not a function`). Prefer `ts-loader` with `jsx: react-jsx` in your tsconfig.

## Dev server

1.0 bundles **webpack-dev-server v5** (0.16 used v4). Packer’s built-in defaults are unchanged — port **9000**, hot reload, compression, and a CORS header — so apps that never customized `devServer` need no changes.

If you pass a custom `devServer` block, update it for v5. See the [webpack-dev-server v5 migration guide](https://github.com/webpack/webpack-dev-server/blob/main/migration-v5.md) for the full list.

**Scripts**

Use `npx` so CLI binaries resolve from `@ekz/packer` when it is your only direct dev dependency:

```json
{
    "scripts": {
        "build:dev": "npx webpack --mode=development",
        "build:prod": "npx webpack --mode=production",
        "build:watch": "npx webpack-dev-server --mode=development"
    }
}
```

**Proxy**

`proxy` must be an array in v5 (object keys are no longer accepted):

```js
// 0.16 (v4)
devServer: {
    proxy: {
        '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true
        }
    }
}

// 1.0 (v5)
devServer: {
    proxy: [{
        context: ['/api'],
        target: 'http://localhost:8080',
        changeOrigin: true
    }]
}
```

**HTTPS and HTTP/2**

Replace `https` / `http2` with the `server` option:

```js
devServer: {
    server: {
        type: 'https', // or 'spdy' for HTTP/2
        options: {
            key: './path/to/server.key',
            cert: './path/to/server.crt'
        }
    }
}
```

**Custom middleware**

Replace `onBeforeSetupMiddleware` / `onAfterSetupMiddleware` with `setupMiddlewares`:

```js
devServer: {
    setupMiddlewares: (middlewares, devServer) => {
        // add custom middleware before or after defaults
        return middlewares;
    }
}
```

## Custom ESLint rules

Move rule overrides from `.eslintrc` into `eslint.config.js` as an additional config object after the Packer spreads. See [ESLint](/docs/getting-started/eslint#custom-rules).

## No ESLint 9 intermediate step

Consumers can go directly from **0.16** to **1.0** flat config. There was no published ESLint 9 transition release.
