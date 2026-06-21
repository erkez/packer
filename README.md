# Packer

Opinionated webpack bundler for React applications — minimal configuration, ESLint and TypeScript support out of the box.

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

See the [getting started guide](https://packer.ekz.io/docs/getting-started/installation) for ESLint, TypeScript, and migration from 0.16.

The full package README (also published to npm) is in [packages/packer/README.md](packages/packer/README.md).

## License

MIT — see [LICENSE](LICENSE).
