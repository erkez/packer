# Webpack

Create `webpack.config.js` in your application root:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

This enables:

- Babel for JS/JSX in `src/` (and TS/TSX when no `tsconfig.json`)
- `ts-loader` (transpile-only) for TS/TSX when `tsconfig.json` is present — typechecking runs separately via ForkTsChecker
- SCSS and CSS extraction
- Static assets (images, fonts, SVG)
- ESLint during webpack builds (lints changed modules only in development)
- ForkTsChecker when `tsconfig.json` is present
- Webpack filesystem cache and fast dev source maps (`eval-cheap-module-source-map`)
- Dev server on port **9000** with hot reload

## Custom HTML template

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    html: {
        template: 'public/index.html',
        filename: 'index.html'
    }
});
```

## TypeScript entry

Override the default `./src/index.js` entry when using TSX:

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    entry: {
        main: './src/index.tsx'
    }
});
```

See [Configuration](/docs/guides/configuration) for `publicPath`, aliases, proxy, and other options.
