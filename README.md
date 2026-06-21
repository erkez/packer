# Packer

[![CI](https://github.com/erkez/packer/actions/workflows/ci.yml/badge.svg)](https://github.com/erkez/packer/actions/workflows/ci.yml)
[![Release](https://github.com/erkez/packer/actions/workflows/release.yml/badge.svg)](https://github.com/erkez/packer/actions/workflows/release.yml)

Opinionated bundler config for React applications - Webpack support today, with Vite support in alpha.

**Documentation:** [packer.ekz.io](https://packer.ekz.io/)

## Install

The 1.0 release is in **beta**:

```sh
yarn add -D @ekz/packer@beta
```

Create `webpack.config.js` in your application root:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

Or try the alpha Vite support with `vite.config.js`:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration();
```

Vite support is currently **alpha** and its API may change before it is promoted to stable.

See the [getting started guide](https://packer.ekz.io/docs/getting-started/installation) for ESLint, TypeScript, and migration from 0.16.

The full package README (also published to npm) is in [packages/packer/README.md](packages/packer/README.md).

## License

MIT — see [LICENSE](LICENSE).
