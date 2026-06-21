---
sidebar_position: 2
---

# Webpack configuration

Webpack is Packer's stable bundler path. Use `Packer.webpack.createApplicationConfiguration(options)` from `webpack.config.js`.

```js
const path = require('path');
const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration({
    entry: {
        'my-app': './src/index.tsx'
    },
    output: {
        path: 'dist',
        publicPath: '/my-app/'
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
        }
    },
    devServer: {
        proxy: [{
            context: ['/'],
            target: 'http://localhost:8080',
            changeOrigin: true
        }]
    }
});
```

## Defaults

| Option | Default |
|--------|---------|
| Entry | `{ main: './src/index.js' }` |
| Output path | `dist` |
| Public path | `/` |
| Dev server port | `9000` |
| Dev server hot reload | `true` |
| Dev server compression | `true` |
| Dev server headers | `Access-Control-Allow-Origin: *` |
| Asset paths | `assets/js/`, `assets/css/`, `assets/static/` |
| Production filenames | Content hash when `--mode=production` |

## Common options

| Option | Purpose |
|--------|---------|
| `entry` | Webpack entry object or value. Use this for TSX apps, multi-entry apps, or non-default entry files. |
| `output.path` | Output directory relative to the app root. |
| `output.publicPath` | Public URL prefix for emitted assets. |
| `assetPaths.js` | Directory prefix for emitted JS files. |
| `assetPaths.css` | Directory prefix for emitted CSS files. |
| `assetPaths.static` | Directory prefix for emitted images, fonts, SVG, and other static assets. |
| `useHashInFileNames` | Enables content hashes in production filenames. Set to `false` for predictable filenames. |
| `html` | Options passed to `html-webpack-plugin`. Set to `null` to disable HTML generation. |
| `resolve` | Merged into Webpack `resolve`. Packer always adds `@root` → `./src` unless you override it. |
| `devServer` | Merged into `webpack-dev-server` config. |

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    entry: {
        main: './src/index.tsx',
        admin: './src/admin.tsx'
    },
    output: {
        path: 'build',
        publicPath: '/my-app/'
    },
    assetPaths: {
        js: 'static/js/',
        css: 'static/css/',
        static: 'static/media/'
    },
    html: {
        template: 'public/index.html',
        filename: 'index.html'
    }
});
```

## Development server

`devServer` is merged with Packer's defaults: port `9000`, hot reload, compression, and `Access-Control-Allow-Origin: *`.

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    devServer: {
        port: 3000,
        proxy: [{
            context: ['/api'],
            target: 'http://localhost:8080',
            changeOrigin: true
        }]
    }
});
```

## TypeScript config

Packer looks for `tsconfig.json` in the application root. When found, it enables `ts-loader` and ForkTsChecker.

If your `tsconfig.json` lives elsewhere, set `tsconfigPath`:

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    tsconfigPath: 'src/main/web/tsconfig.json'
});
```

Without a discoverable TypeScript config, `.tsx` files fall through to Babel, which can emit `jsxDEV` and crash in production.

## Babel and file extensions

Packer uses Babel for JS/JSX, and for TS/TSX when no TypeScript config is found.

| Option | Purpose |
|--------|---------|
| `babelEnvTargets` | Targets passed to `@babel/preset-env`. Defaults to `> 0.25%, not dead`. |
| `babelPresets` | Additional Babel presets appended after Packer defaults. |
| `babelPlugins` | Additional Babel plugins appended after Packer defaults. |
| `babelOptions` | Extra `babel-loader` options merged over Packer defaults. |
| `fileExtensions` | Extensions Webpack resolves. Defaults to `.js`, `.jsx`, `.ts`, `.tsx`. |

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    babelEnvTargets: {
        browsers: ['last 2 Chrome versions']
    },
    babelPlugins: ['babel-plugin-example'],
    fileExtensions: ['.web.tsx', '.tsx', '.ts', '.jsx', '.js']
});
```

## Plugins, loaders, and globals

Use these escape hatches when the built-in rules are not enough.

| Option | Purpose |
|--------|---------|
| `plugins` | Additional Webpack plugins appended after Packer's plugins. |
| `loaders` | Additional module rules appended after Packer's loader rules. |
| `provide` | Values passed to Webpack `ProvidePlugin`. |
| `define` | Values passed to Webpack `DefinePlugin`. |
| `externals` | Webpack externals config. |
| `target` | Webpack target. Defaults to `web`. |
| `node` | Webpack node options. |

```js
const webpack = require('webpack');

module.exports = Packer.webpack.createApplicationConfiguration({
    define: {
        __APP_VERSION__: JSON.stringify('1.0.0')
    },
    provide: {
        process: 'process/browser'
    },
    plugins: [new webpack.IgnorePlugin({resourceRegExp: /^\.\/locale$/})],
    loaders: [{
        test: /\.txt$/,
        type: 'asset/source'
    }]
});
```

## Optimization

| Option | Purpose |
|--------|---------|
| `splitChunks` | Webpack `optimization.splitChunks`. Defaults to `{ chunks: 'all', automaticNameDelimiter: '.' }`. |
| `terserOptions` | Options passed to `terser-webpack-plugin`. |
| `miniCssExtractPluginOptions` | Options merged into `mini-css-extract-plugin`. |
| `devtool` | Development source map setting. Defaults to `eval-cheap-module-source-map`; production disables `devtool`. |
| `enableProgressPlugin` | Enables Webpack `ProgressPlugin`. Defaults to `true`. |
| `eslint` | Options merged into `eslint-webpack-plugin`. |

```js
module.exports = Packer.webpack.createApplicationConfiguration({
    splitChunks: false,
    terserOptions: {
        terserOptions: {
            compress: {
                drop_console: true
            }
        }
    },
    eslint: {
        failOnWarning: false
    },
    enableProgressPlugin: false
});
```

## Library builds

For UMD/library output, use `Packer.webpack.createLibraryConfiguration(name, options)` instead. Application defaults such as the HTML plugin and split chunks are adjusted for library mode.

```js
module.exports = Packer.webpack.createLibraryConfiguration('MyLibrary', {
    entry: {
        index: './src/index.ts'
    }
});
```
