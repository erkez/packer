---
sidebar_position: 1
---

# Installation

```sh
yarn add -D @ekz/packer
npm install --save-dev @ekz/packer
```

`@ekz/packer` installs both bundlers. An app that only uses one can install that half on its own and skip the other bundler's toolchain:

| Package | Installs | Import |
| --- | --- | --- |
| `@ekz/packer` | Webpack, Vite, ESLint config, tsconfig presets | `require('@ekz/packer').vite`, `.webpack` |
| `@ekz/packer-vite` | Vite, `@vitejs/plugin-react`, `vite-plugin-checker`, `sass`, tsconfig presets | `require('@ekz/packer-vite')` |
| `@ekz/packer-webpack` | Webpack, its loaders and plugins, Babel, the `eslint` engine for `eslint-webpack-plugin`, `sass`, tsconfig presets | `require('@ekz/packer-webpack')` |

The standalone packages do not ship the ESLint config; add [`@ekz/eslint-config-packer`](/docs/getting-started/eslint) alongside them if you want it.

## Next steps

1. Add a [Webpack config](/docs/getting-started/webpack) or try [Vite](/docs/getting-started/vite)
2. Add [ESLint flat config](/docs/getting-started/eslint) (optional but recommended)
3. Add [recommended scripts](/docs/getting-started/scripts) to `package.json`
4. Copy or adapt the [example app](/docs/guides/example-app)

If you are upgrading from 0.16, read [Migrating from 0.16](/docs/migration/from-0-16). If you are moving an existing app from Webpack to Vite, read [Migrating from Webpack to Vite](/docs/migration/from-webpack-to-vite).
