# Webpack

Create `webpack.config.js` in your application root:

```js
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration();
```

This enables:

- Babel for JS/JSX/TS/TSX in `src/`
- SCSS and CSS extraction
- Static assets (images, fonts, SVG)
- ESLint during webpack builds
- ForkTsChecker when `tsconfig.json` is present
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
