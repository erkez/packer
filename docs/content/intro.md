---
sidebar_position: 1
slug: /
---

# Packer

Packer is an opinionated configuration for bundlers that reduces the setup and maintenance required to build a React application. Webpack support is currently the most stable option; Vite support is available in **alpha** version only.

## Features

- Minimum configuration for a React app
- Webpack application and library configuration
- Vite application configuration
- ESLint 10 flat config out of the box
- TypeScript support out of the box

## Quick start

```sh
yarn add -D @ekz/packer@beta
```

```js
// webpack.config.js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

Or try Vite:

```js
// vite.config.js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration();
```

See [Installation](/docs/getting-started/installation) for beta vs stable tags, ESLint setup, and TypeScript configuration.

## Requirements

- Node.js **24+**
- `@ekz/packer` **1.0.0-beta** or later (install with `@beta` until stable `1.0.0` on `latest`)
