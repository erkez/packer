---
sidebar_position: 1
slug: /
---

# Packer

Packer is an opinionated webpack-based bundler that reduces the configuration and maintenance needed to build a React application.

## Features

- Minimum configuration for a React app
- Automatic HTML generation via `html-webpack-plugin`
- ESLint 10 flat config out of the box
- TypeScript support out of the box
- `webpack-dev-server` included

## Quick start

```sh
yarn add -D @ekz/packer@beta
```

```js
// webpack.config.js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

See [Installation](/docs/getting-started/installation) for beta vs stable tags, ESLint setup, and TypeScript configuration.

## Requirements

- Node.js **24+**
- `@ekz/packer` **1.0.0-beta** or later (install with `@beta` until stable `1.0.0` on `latest`)
