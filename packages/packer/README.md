# Packer

Packer is an opinionated webpack based bundler that does its best to reduce the amount of configuration
and maintenance needed to create a React application.

## Features

* Minimum configuration to create a proper React application
* Automatic (or template based) HTML generation using `html-webpack-plugin`
* ESLint support out of the box
* Typescript support out of the box
* `webpack-dev-server` included

## Installation

Using `yarn`:

```sh
yarn add -D @ekz/packer
```

Using `npm`:

```sh
npm install --save-dev @ekz/packer
```

Create a `webpack.config.js` in your application root directory:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

For ESLint, create the file `.eslintrc` in your application root directory:

```json
{
    "extends": [
        "@ekz/packer/recommended",
        // "@ekz/packer/typescript" for Typescript
    ]
}
```

## package.json configuration

It is useful to add the following commands to your `scripts` property in `package.json`:

```json
{
    // ... other properties in package.json
    "scripts": {
        "lint": "eslint --ext .js --ext .jsx --ext .ts --ext .tsx .",
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
