# Packer

[![npm version](https://img.shields.io/npm/v/%40ekz%2Fpacker)](https://www.npmjs.com/package/@ekz/packer)
[![npm downloads](https://img.shields.io/npm/dm/%40ekz%2Fpacker)](https://www.npmjs.com/package/@ekz/packer)

Opinionated Webpack and Vite configuration for React applications, with built-in ESLint and TypeScript support.

**Documentation:** [packer.ekz.io](https://packer.ekz.io/)

## Features

- Minimum configuration to create a proper React application
- Webpack application and library configuration
- Vite application configuration
- ESLint support out of the box
- TypeScript support out of the box

## Installation

```sh
yarn add -D @ekz/packer
```

```sh
npm install --save-dev @ekz/packer
```

Create a `webpack.config.js` in your application root directory:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

Or create a `vite.config.js` if you prefer Vite:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration();
```

For ESLint, create `eslint.config.js` in your application root directory:

```js
const recommended = require('@ekz/packer/recommended');

module.exports = [...recommended];
```

For TypeScript, add the typescript config:

```js
const recommended = require('@ekz/packer/recommended');
const typescript = require('@ekz/packer/typescript');

module.exports = [...recommended, ...typescript];
```

### Migrating from 0.16

1.0.0 is a breaking release. The last published version used `.eslintrc` and shipped JavaScript from `src/`. This release is written in TypeScript, ships compiled output from `dist/`, requires Node.js 24+, and uses ESLint 10 flat config.

**ESLint**

1. Delete `.eslintrc`
2. Add `eslint.config.js` (see above)
3. Update your lint script to `"lint": "npx eslint ."`

**Node.js**

Requires Node.js 24 or later (see `.nvmrc` in your project or use `nvm use`).

**TypeScript config location**

Packer looks for `tsconfig.json` at the app root. If yours is elsewhere (for example `src/main/web/tsconfig.json`), set `tsconfigPath` or add a root config that extends it:

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    tsconfigPath: 'src/main/web/tsconfig.json'
});
```

Without a discoverable TypeScript config, `.tsx` is transpiled by Babel instead of `ts-loader`, which can emit development-only `jsxDEV` and crash in production.

**Dev server**

1.0 bundles **webpack-dev-server v5** (0.16 used v4). Packer’s built-in defaults are unchanged — port **9000**, hot reload, compression, and a CORS header — so apps that never customized `devServer` need no changes.

If you pass a custom `devServer` block, update it for v5. See the [webpack-dev-server v5 migration guide](https://github.com/webpack/webpack-dev-server/blob/main/migration-v5.md) for the full list.

Use `npx webpack` and `npx webpack-dev-server` in scripts when `@ekz/packer` is your only direct dev dependency (see [Scripts](#packagejson-configuration) below).

Common changes:

- **`proxy`** — must be an array with a `context` property (object keys are no longer accepted)
- **`https` / `http2`** — use `server: { type: 'https' | 'spdy', options: { ... } }`
- **`onBeforeSetupMiddleware` / `onAfterSetupMiddleware`** — use `setupMiddlewares`

**Custom ESLint rules**

If you had rule overrides in `.eslintrc`, move them into `eslint.config.js` as an additional config object after the Packer spreads:

```js
const recommended = require('@ekz/packer/recommended');
const typescript = require('@ekz/packer/typescript');

module.exports = [
    ...recommended,
    ...typescript,
    {
        rules: {
            // your overrides
        }
    }
];
```

## package.json configuration

For Webpack applications, add the following commands to your `scripts` property in `package.json`:

```json
{
    // ... other properties in package.json
    "scripts": {
        "lint": "npx eslint .",
        "lint:fix": "yarn lint --fix",
        "build": "yarn build:dev",
        "build:dev": "npx webpack --mode=development",
        "build:prod": "npx webpack --mode=production",
        "build:watch": "npx webpack-dev-server --mode=development",
        "start": "yarn build:watch"
    }
}
```

Use `npx webpack` and `npx webpack-dev-server` so CLI binaries resolve from hoisted dependencies when `@ekz/packer` is the only direct dev dependency.

For Vite applications, use Vite's CLI and keep linting separate:

```json
{
    "scripts": {
        "lint": "npx eslint .",
        "lint:fix": "yarn lint --fix",
        "build": "yarn build:prod",
        "build:dev": "npx vite build --mode development",
        "build:prod": "npx vite build",
        "preview": "npx vite preview",
        "start": "npx vite"
    }
}
```

## Sample configuration

Webpack:

```js
const path = require('path');
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration({
    entry: {
        'my-app': './src/index.tsx'
    },
    output: {
        path: 'dist',
        publicPath: '/my-app/'
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
        }
    },
    devServer: {
        proxy: [{
            context: ['/'],
            target: 'http://localhost:8080',
            changeOrigin: true
        }]
    }
});
```

Vite:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration({
    base: '/my-app/'
});
```

## Example application

See [`examples/typescript`](../../examples/typescript) for a minimal React + TypeScript Webpack app, or [`examples/typescript-vite`](../../examples/typescript-vite) for the Vite example. Those folders can be run inside this monorepo for development, or copied as starter templates.
