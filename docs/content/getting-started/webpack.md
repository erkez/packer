# Webpack

Create `webpack.config.js` in your application root:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

This enables:

- Babel for JS/JSX in `src/` (and TS/TSX when no `tsconfig.json` is found)
- `ts-loader` (transpile-only) for TS/TSX when a TypeScript config is found — typechecking runs separately via ForkTsChecker
- SCSS and CSS extraction
- Static assets (images, fonts, SVG)
- ESLint during webpack builds (lints changed modules only in development)
- ForkTsChecker when a TypeScript config is found
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

## TypeScript config location

Packer looks for `tsconfig.json` in the application root (where you run webpack). When found, `.ts`/`.tsx` files are transpiled with `ts-loader` using your `jsx` setting (typically `react-jsx`). Without it, TypeScript sources go through Babel instead, which can emit development-only `jsxDEV` calls and break production bundles.

If your `tsconfig.json` lives elsewhere — for example `src/main/web/tsconfig.json` — point Packer at it:

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    tsconfigPath: 'src/main/web/tsconfig.json'
});
```

Alternatively, add a root `tsconfig.json` that extends your nested config.

See [Configuration](/docs/guides/configuration) for `publicPath`, aliases, proxy, and other options.
