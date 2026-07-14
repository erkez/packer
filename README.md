# Packer

[![CI](https://github.com/erkez/packer/actions/workflows/ci.yml/badge.svg)](https://github.com/erkez/packer/actions/workflows/ci.yml)
[![Release](https://github.com/erkez/packer/actions/workflows/release.yml/badge.svg)](https://github.com/erkez/packer/actions/workflows/release.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/erkez/packer/badge)](https://securityscorecards.dev/viewer/?uri=github.com/erkez/packer)
[![npm version](https://img.shields.io/npm/v/%40ekz%2Fpacker)](https://www.npmjs.com/package/@ekz/packer)
[![npm downloads](https://img.shields.io/npm/dm/%40ekz%2Fpacker)](https://www.npmjs.com/package/@ekz/packer)

Opinionated Webpack and Vite configuration for React applications, with built-in ESLint and TypeScript support.

**Documentation:** [packer.ekz.io](https://packer.ekz.io/)

## Install

```sh
yarn add -D @ekz/packer
```

Create `webpack.config.js` in your application root:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

Or use Vite with `vite.config.js`:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration();
```

See the [getting started guide](https://packer.ekz.io/docs/getting-started/installation) for ESLint, TypeScript, and migration from 0.16.

The full package README (also published to npm) is in [packages/packer/README.md](packages/packer/README.md).

## License

MIT — see [LICENSE](LICENSE).
