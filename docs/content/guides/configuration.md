# Configuration

`createApplicationConfiguration(options)` merges your options with Packer defaults. Pass a factory that receives webpack `(env, argv)` — mode comes from `--mode=development|production`.

## Sample configuration

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

## Built-in alias

Packer sets `@root` → `./src`. Use it in imports and mirror it in `tsconfig.json` `paths` for TypeScript.

## Library builds

For UMD/library output, use `Packer.webpack.createLibraryConfiguration(name, options)` instead. Application defaults (HTML plugin, split chunks) are adjusted for library mode.

## Defaults reference

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

See the `@ekz/packer` TypeScript types in `dist/` for the full options surface.
