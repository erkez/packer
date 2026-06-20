# Packer

Packer is an opinionated webpack based bundler that does its best to reduce the amount of configuration
and maintenance needed to create a React application.

**Documentation:** [packer.ekz.io](https://packer.ekz.io/)

## Features

* Minimum configuration to create a proper React application
* Automatic (or template based) HTML generation using `html-webpack-plugin`
* ESLint support out of the box
* Typescript support out of the box
* `webpack-dev-server` included

## Installation

The 1.0 release is currently in **beta**. Install the beta tag for early access:

```sh
yarn add -D @ekz/packer@beta
# or pin exactly: yarn add -D @ekz/packer@1.0.0-beta.0
```

```sh
npm install --save-dev @ekz/packer@beta
```

When 1.0.0 is stable on `latest`, the default install commands apply:

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

It is useful to add the following commands to your `scripts` property in `package.json`:

```json
{
    // ... other properties in package.json
    "scripts": {
        "lint": "npx eslint .",
        "lint:fix": "yarn lint --fix",
        "build": "yarn build:dev",
        "build:dev": "webpack --mode=development",
        "build:prod": "webpack --mode=production",
        "build:watch": "webpack-dev-server --mode=development",
        "start": "yarn build:watch"
    }
}
```

## Sample configuration

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
        proxy: {
            '/': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
});
```

## Example application

See [`examples/typescript`](../../examples/typescript) for a minimal React + TypeScript app. That folder can be run inside this monorepo for development, or copied as a starter template — see its [README](../../examples/typescript/README.md) for both workflows.
