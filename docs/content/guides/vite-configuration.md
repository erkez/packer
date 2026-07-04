---
sidebar_position: 3
---

# Vite configuration

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
| `tsconfigPath` | Path to `tsconfig.json` used for typechecking. Defaults to `tsconfig.json` in the app root. |
| `typecheck` | Enables automatic TypeScript typechecking via `vite-plugin-checker`. Defaults to `true`. |

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

## TypeScript typechecking

Packer looks for `tsconfig.json` in the application root (`INIT_CWD`) and, when found, adds `vite-plugin-checker` so `.ts`/`.tsx` files are typechecked during `vite build` and in the dev server — the same behavior as Webpack's `ForkTsCheckerWebpackPlugin`. Without a `tsconfig.json`, no typechecking plugin is added.

**Runtime and build impact:**

- **Bundled output**: none. Typechecking runs at build/dev time only and never emits anything into `dist` — no added client-side code or bytes.
- **`vite build`**: adds real time, roughly proportional to your TypeScript program size. On the minimal example app in this repo, `vite build` went from ~150ms to ~700ms with typechecking on. A type error fails the build (non-zero exit code), so CI is reliably gated.
- **Dev server**: non-blocking. Checking runs in a separate worker; it does not slow down HMR or the edit-reload loop. Errors surface via the terminal and an in-browser overlay, independent of the dev server's responsiveness.

Point Packer at a `tsconfig.json` in a non-default location:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    tsconfigPath: 'src/main/web/tsconfig.json'
});
```

Disable typechecking entirely, for example if your app has an existing backlog of type errors:

```js
module.exports = Packer.vite.createApplicationConfiguration({
    typecheck: false
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
