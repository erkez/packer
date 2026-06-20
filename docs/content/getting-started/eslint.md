# ESLint

Packer ships ESLint 10 **flat config** modules. Legacy `.eslintrc` is not supported in 1.0.

## JavaScript / JSX

Create `eslint.config.js`:

```js
const recommended = require('@ekz/packer/recommended');

module.exports = [...recommended];
```

## TypeScript

Add the TypeScript overlay:

```js
const recommended = require('@ekz/packer/recommended');
const typescript = require('@ekz/packer/typescript');

module.exports = [...recommended, ...typescript];
```

## Lint script

```json
{
    "scripts": {
        "lint": "npx eslint .",
        "lint:fix": "yarn lint --fix"
    }
}
```

Do not pass `--ext` or set `ESLINT_USE_FLAT_CONFIG` — flat config is the default.

## Custom rules

Append config objects after the Packer spreads:

```js
module.exports = [
    ...recommended,
    ...typescript,
    {
        rules: {
            // your overrides
        }
    }
];
```

## TypeScript project config

Extend Packer's shared tsconfig:

```json
{
    "extends": "./node_modules/@ekz/packer/tsconfig/recommended.json",
    "include": ["src"],
    "compilerOptions": {
        "baseUrl": ".",
        "ignoreDeprecations": "6.0",
        "paths": {
            "@root/*": ["src/*"]
        }
    }
}
```

The `@root/*` path matches Packer's webpack alias. When copying the monorepo example, adjust the `extends` path if dependencies are hoisted differently.
