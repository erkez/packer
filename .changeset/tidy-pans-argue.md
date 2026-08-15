---
'@ekz/packer': patch
'@ekz/eslint-config-packer': patch
---

Declare `eslint-webpack-plugin` (and `eslint`) as dependencies of `@ekz/packer`. `dist/webpack.js` has always required the plugin, but it was declared by `@ekz/eslint-config-packer` instead, which never used it. npm's flat hoisting made that resolve by accident; under Yarn 4 the plugin nests out of Packer's resolution path and `require('@ekz/packer')` fails with `Cannot find module 'eslint-webpack-plugin'` — including for Vite-only consumers. `@ekz/eslint-config-packer` drops the plugin and its `webpack` dev dependency, which existed only to satisfy the plugin's peer range.
