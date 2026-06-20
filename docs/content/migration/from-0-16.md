# Migrating from 0.16

1.0.0 is a breaking release. The last published stable version used `.eslintrc` and shipped JavaScript from `src/`. This release:

- Is written in TypeScript and ships compiled output from `dist/`
- Requires Node.js **24+**
- Uses ESLint **10** flat config only

Install the beta while 1.0 is in pre-release:

```sh
yarn add -D @ekz/packer@beta
```

## ESLint

1. Delete `.eslintrc`
2. Add `eslint.config.js` — see [ESLint setup](/docs/getting-started/eslint)
3. Update your lint script to `"lint": "npx eslint ."`

## Node.js

Requires Node.js 24 or later. Add an `.nvmrc` (for example `v24.17`) and run `nvm use`.

## Webpack

The public API is unchanged:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

If you customized webpack via Packer options, review [Configuration](/docs/guides/configuration) — defaults may have changed with dependency upgrades.

## Custom ESLint rules

Move rule overrides from `.eslintrc` into `eslint.config.js` as an additional config object after the Packer spreads. See [ESLint](/docs/getting-started/eslint#custom-rules).

## No ESLint 9 intermediate step

Consumers can go directly from **0.16** to **1.0** flat config. There was no published ESLint 9 transition release.
