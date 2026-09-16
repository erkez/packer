# @ekz/packer-vite

[![npm version](https://img.shields.io/npm/v/%40ekz%2Fpacker-vite)](https://www.npmjs.com/package/@ekz/packer-vite)

Opinionated Vite configuration for React applications, with built-in TypeScript support. This is the Vite half of [`@ekz/packer`](https://www.npmjs.com/package/@ekz/packer), published on its own so an app that only uses Vite does not install the Webpack toolchain.

**Documentation:** [packer.ekz.io](https://packer.ekz.io/)

## Installation

```sh
yarn add -D @ekz/packer-vite
```

Create `vite.config.js` in your application root:

```js
const Packer = require('@ekz/packer-vite');

module.exports = Packer.createApplicationConfiguration();
```

The API is identical to `require('@ekz/packer/vite')`. ESLint configs are not included; add [`@ekz/eslint-config-packer`](https://www.npmjs.com/package/@ekz/eslint-config-packer) for those. TypeScript presets are at `@ekz/packer-vite/tsconfig/recommended.json`.

## License

MIT
