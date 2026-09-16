# @ekz/packer-webpack

[![npm version](https://img.shields.io/npm/v/%40ekz%2Fpacker-webpack)](https://www.npmjs.com/package/@ekz/packer-webpack)

Opinionated Webpack configuration for React applications, with built-in TypeScript support. This is the Webpack half of [`@ekz/packer`](https://www.npmjs.com/package/@ekz/packer), published on its own so an app that only uses Webpack does not install the Vite toolchain.

**Documentation:** [packer.ekz.io](https://packer.ekz.io/)

## Installation

```sh
yarn add -D @ekz/packer-webpack
```

Create `webpack.config.js` in your application root:

```js
const Packer = require('@ekz/packer-webpack');

module.exports = Packer.createApplicationConfiguration();
```

The API is identical to `require('@ekz/packer/webpack')`. ESLint configs are not included; add [`@ekz/eslint-config-packer`](https://www.npmjs.com/package/@ekz/eslint-config-packer) for those. TypeScript presets are at `@ekz/packer-webpack/tsconfig/recommended.json`.

## License

MIT
