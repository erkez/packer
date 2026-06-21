---
sidebar_position: 3
---

# Vite configuration

Vite support in `@ekz/packer` is currently **alpha**. The API may change before it is promoted to stable.

Use `Packer.vite.createApplicationConfiguration(options)` from `vite.config.js`.

```js
const Packer = require('@ekz/packer');

module.exports = Packer.vite.createApplicationConfiguration({
    base: '/my-app/',
    server: {
        proxy: {
            '/api': 'http://localhost:8080'
        }
    }
});
```

## Defaults

| Option | Default |
|--------|---------|
| Root | Current app root |
| Entry | `index.html` |
| Output path | `dist` |
| Dev server port | `9000` |
| Dev server headers | `Access-Control-Allow-Origin: *` |
| Asset paths | `assets/js/`, `assets/css/`, `assets/static/` |
| Production filenames | Content hash by default |

## Common options

| Option | Purpose |
|--------|---------|
| `root` | Vite project root, resolved relative to the app root. Defaults to `.`. |
| `base` | Public base path for served and built assets. Passed directly to Vite. |
| `entry` | HTML entry file or named entry map. Defaults to `index.html`. |
| `outDir` | Output directory. Defaults to `dist`. |
| `assetPaths.js` | Directory prefix for emitted JS chunks. |
| `assetPaths.css` | Directory prefix for emitted CSS assets. |
| `assetPaths.static` | Directory prefix for emitted static assets. |
| `useHashInFileNames` | Enables hashed production filenames. Defaults to `true`. |

```js
module.exports = Packer.vite.createApplicationConfiguration({
    root: '.',
    base: '/my-app/',
    outDir: 'build',
    assetPaths: {
        js: 'static/js/',
        css: 'static/css/',
        static: 'static/media/'
    },
    useHashInFileNames: true
});
```

## Entry and HTML

Vite uses `index.html` as the application entry. Add the module script in the HTML file:

```html
<div id="root"></div>
<script type="module" src="/src/index.tsx"></script>
```

Override the entry when your HTML file has a different name:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    entry: 'app.html'
});
```

For multiple HTML entries, pass a named map:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    entry: {
        app: 'index.html',
        admin: 'admin.html'
    }
});
```

## React plugin

Packer enables `@vitejs/plugin-react` by default. Pass options through `react`, or disable the default plugin when you need full control:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    react: {
        jsxRuntime: 'automatic'
    }
});
```

Disable the default plugin when you want to provide your own React plugin setup:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    react: false,
    plugins: [
        // custom Vite plugins
    ]
});
```

## Server options

`server` is merged with Packer's defaults: port `9000` and `Access-Control-Allow-Origin: *`.

```js
module.exports = Packer.vite.createApplicationConfiguration({
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    }
});
```

## Resolve and aliases

Packer sets `@root` → `./src`. Add or override aliases through Vite's `resolve` config:

```js
const path = require('path');

module.exports = Packer.vite.createApplicationConfiguration({
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, 'src/shared')
        }
    }
});
```

## Build options

Packer configures Vite/Rollup output names from `assetPaths` and `useHashInFileNames`. Pass native Vite build options through `build`; they are merged with Packer's defaults.

```js
module.exports = Packer.vite.createApplicationConfiguration({
    build: {
        sourcemap: true,
        minify: 'esbuild',
        rollupOptions: {
            external: ['react', 'react-dom']
        }
    }
});
```

If you set `build.rollupOptions.output`, it may override Packer's asset naming defaults.

## Native Vite options

`VitePackerOptions` extends Vite's `UserConfig` for most top-level options. Pass native Vite options such as `base`, `mode`, `publicDir`, `cacheDir`, `define`, `css`, `json`, `esbuild`, `optimizeDeps`, and `preview` directly:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    define: {
        __APP_VERSION__: JSON.stringify('1.0.0')
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly'
        }
    },
    optimizeDeps: {
        include: ['some-cjs-package']
    },
    preview: {
        port: 5000
    }
});
```
