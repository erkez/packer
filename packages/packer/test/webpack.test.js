'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

const {
    babelOptions,
    findPlugin,
    libraryConfig,
    normalize,
    pluginNames,
    webpackConfig
} = require('./helpers');

test('mode is passed through and drives production', () => {
    assert.equal(webpackConfig().mode, 'production');
    assert.equal(webpackConfig({}, { mode: 'development' }).mode, 'development');
});

test('production hashes js, css and static asset filenames', () => {
    const config = webpackConfig();

    assert.equal(config.output.filename, 'assets/js/[name].[chunkhash:8].js');
    assert.equal(config.output.chunkFilename, 'assets/js/[id].[chunkhash:8].js');
    assert.equal(config.output.assetModuleFilename, 'assets/static/[name].[hash:8][ext][query]');
    assert.equal(
        findPlugin(config, 'MiniCssExtractPlugin').options.filename,
        'assets/css/[name].[chunkhash:8].css'
    );
});

test('development does not hash filenames', () => {
    const config = webpackConfig({}, { mode: 'development' });

    assert.equal(config.output.filename, 'assets/js/[name].js');
    assert.equal(config.output.chunkFilename, 'assets/js/[id].js');
    assert.equal(config.output.assetModuleFilename, 'assets/static/[name][ext][query]');
    assert.equal(
        findPlugin(config, 'MiniCssExtractPlugin').options.filename,
        'assets/css/[name].css'
    );
});

test('useHashInFileNames: false disables hashing even in production', () => {
    const config = webpackConfig({ useHashInFileNames: false });

    assert.equal(config.output.filename, 'assets/js/[name].js');
    assert.equal(config.output.chunkFilename, 'assets/js/[id].js');
});

test('devtool is applied in development and dropped in production', () => {
    assert.equal(webpackConfig().devtool, undefined);
    assert.equal(
        webpackConfig({}, { mode: 'development' }).devtool,
        'eval-cheap-module-source-map'
    );
    assert.equal(
        webpackConfig({ devtool: 'source-map' }, { mode: 'development' }).devtool,
        'source-map'
    );
});

test('minification is production-only, and terserOptions reach Terser', () => {
    assert.equal(webpackConfig().optimization.minimize, true);
    assert.equal(webpackConfig({}, { mode: 'development' }).optimization.minimize, false);

    const config = webpackConfig({ terserOptions: { parallel: false } });
    assert.equal(config.optimization.minimizer[0].options.parallel, false);
});

test('eslint plugin fails the build only in production', () => {
    const production = findPlugin(webpackConfig(), 'ESLintWebpackPlugin').options;
    assert.equal(production.failOnError, true);
    assert.equal(production.failOnWarning, true);
    assert.equal(production.emitWarning, false);
    assert.equal(production.lintDirtyModulesOnly, false);

    const development = findPlugin(
        webpackConfig({}, { mode: 'development' }),
        'ESLintWebpackPlugin'
    ).options;
    assert.equal(development.failOnError, false);
    assert.equal(development.emitWarning, true);
    assert.equal(development.lintDirtyModulesOnly, true);
});

test('eslint option overrides the mode-derived defaults', () => {
    const config = webpackConfig({ eslint: { failOnWarning: false } });
    const { options } = findPlugin(config, 'ESLintWebpackPlugin');

    assert.equal(options.failOnWarning, false);
    assert.equal(options.failOnError, true, 'unrelated defaults survive the merge');
});

test('assetPaths default, and partial overrides merge with the defaults', () => {
    const config = webpackConfig({ assetPaths: { js: 'static/js/' } });

    assert.equal(config.output.filename, 'static/js/[name].[chunkhash:8].js');
    assert.equal(
        findPlugin(config, 'MiniCssExtractPlugin').options.filename,
        'assets/css/[name].[chunkhash:8].css',
        'css keeps its default when only js is overridden'
    );
});

test('output path, publicPath, library, libraryTarget and globalObject', () => {
    const config = webpackConfig({
        output: {
            path: 'build',
            publicPath: '/static/',
            library: 'Thing',
            libraryTarget: 'umd',
            globalObject: 'this'
        }
    });

    assert.ok(config.output.path.endsWith('/build'));
    assert.ok(path.isAbsolute(config.output.path));
    assert.equal(config.output.publicPath, '/static/');
    assert.equal(config.output.library, 'Thing');
    assert.equal(config.output.libraryTarget, 'umd');
    assert.equal(config.output.globalObject, 'this');
});

test('output defaults resolve against INIT_CWD', () => {
    const config = webpackConfig();

    assert.ok(config.output.path.endsWith('/ts-app/dist'));
    assert.equal(config.output.publicPath, '/');
    assert.ok(config.cache.cacheDirectory.endsWith('/ts-app/node_modules/.cache/webpack'));
});

test('a partial output merges with the defaults', () => {
    const config = webpackConfig({ output: { path: 'build' } });

    assert.ok(config.output.path.endsWith('/ts-app/build'));
    assert.equal(config.output.publicPath, '/', 'the fields not supplied keep their defaults');
});

test('an empty publicPath is honoured rather than replaced by the default', () => {
    // webpack reads '' as "emit relative asset URLs", so it must survive as an explicit choice.
    assert.equal(webpackConfig({ output: { publicPath: '' } }).output.publicPath, '');
});

test('entry, target, node and splitChunks pass through', () => {
    assert.deepEqual(webpackConfig().entry, { main: './src/index.js' });
    assert.deepEqual(webpackConfig({ entry: { app: './src/app.js' } }).entry, {
        app: './src/app.js'
    });

    assert.equal(webpackConfig().target, 'web');
    assert.equal(webpackConfig({ target: 'node' }).target, 'node');

    assert.equal(webpackConfig().node, undefined);
    assert.deepEqual(webpackConfig({ node: { __dirname: false } }).node, { __dirname: false });

    assert.deepEqual(webpackConfig().optimization.splitChunks, {
        chunks: 'all',
        automaticNameDelimiter: '.'
    });
    assert.deepEqual(webpackConfig({ splitChunks: { chunks: 'async' } }).optimization.splitChunks, {
        chunks: 'async'
    });
});

test('externals and fileExtensions pass through', () => {
    assert.deepEqual(webpackConfig({ externals: { react: 'React' } }).externals, {
        react: 'React'
    });
    assert.deepEqual(webpackConfig().resolve.extensions, ['.js', '.jsx', '.ts', '.tsx']);
    assert.deepEqual(webpackConfig({ fileExtensions: ['.js'] }).resolve.extensions, ['.js']);
});

test('provide and define reach their plugins', () => {
    const config = webpackConfig({
        provide: { React: 'react' },
        define: { __DEV__: false }
    });

    assert.deepEqual(findPlugin(config, 'ProvidePlugin').definitions, { React: 'react' });
    assert.deepEqual(findPlugin(config, 'DefinePlugin').definitions, { __DEV__: false });
});

test('default plugin set', () => {
    assert.deepEqual(pluginNames(webpackConfig()), [
        'ESLintWebpackPlugin',
        'ProgressPlugin',
        'CleanWebpackPlugin',
        'ForkTsCheckerWebpackPlugin',
        'ProvidePlugin',
        'DefinePlugin',
        'HtmlWebpackPlugin',
        'MiniCssExtractPlugin'
    ]);
});

test('enableProgressPlugin: false drops the progress plugin', () => {
    assert.ok(
        !pluginNames(webpackConfig({ enableProgressPlugin: false })).includes('ProgressPlugin')
    );
});

test('html: null drops HtmlWebpackPlugin, and html options reach it', () => {
    assert.ok(!pluginNames(webpackConfig({ html: null })).includes('HtmlWebpackPlugin'));

    const config = webpackConfig({ html: { title: 'Hello' } });
    assert.equal(findPlugin(config, 'HtmlWebpackPlugin').options.title, 'Hello');
});

test('miniCssExtractPluginOptions merges over the derived filename', () => {
    const config = webpackConfig({ miniCssExtractPluginOptions: { ignoreOrder: true } });
    const { options } = findPlugin(config, 'MiniCssExtractPlugin');

    assert.equal(options.ignoreOrder, true);
    assert.equal(options.filename, 'assets/css/[name].[chunkhash:8].css');
});

test('custom plugins are appended to the defaults', () => {
    class MyPlugin {
        apply() {}
    }

    const names = pluginNames(webpackConfig({ plugins: [new MyPlugin()] }));

    assert.equal(names.at(-1), 'MyPlugin');
    assert.ok(names.includes('MiniCssExtractPlugin'), 'defaults are kept');
});

test('custom loaders are appended to the default rules', () => {
    const loader = { test: /\.toml$/, loader: 'toml-loader' };
    const rules = webpackConfig({ loaders: [loader] }).module.rules;

    assert.deepEqual(rules.at(-1), loader);
    assert.ok(rules.length > 1, 'default rules are kept');
});

test('resolve.alias merges @root with a user object alias', () => {
    const config = webpackConfig({ resolve: { alias: { '@ui': './src/ui' } } });

    assert.ok(config.resolve.alias['@root'].endsWith('/ts-app/src'));
    assert.equal(config.resolve.alias['@ui'], './src/ui');
});

test('resolve.alias appends @root to a user array alias', () => {
    const config = webpackConfig({
        resolve: { alias: [{ name: '@ui', alias: './src/ui' }] }
    });

    assert.equal(config.resolve.alias[0].name, '@ui');
    assert.equal(config.resolve.alias[1].name, '@root');
    assert.ok(config.resolve.alias[1].alias.endsWith('/ts-app/src'));
});

test('a user alias may override @root itself', () => {
    const config = webpackConfig({ resolve: { alias: { '@root': './elsewhere' } } });

    assert.equal(config.resolve.alias['@root'], './elsewhere');
});

test('devServer defaults, and user options merge over them', () => {
    const defaults = webpackConfig().devServer;

    assert.equal(defaults.port, 9000);
    assert.equal(defaults.compress, true);
    assert.equal(defaults.hot, true);
    assert.deepEqual(defaults.headers, { 'Access-Control-Allow-Origin': '*' });

    const custom = webpackConfig({ devServer: { port: 3000 } }).devServer;
    assert.equal(custom.port, 3000);
    assert.equal(custom.compress, true, 'unrelated defaults survive');
});

test('devServer headers merge as an object, keeping the CORS default', () => {
    const { headers } = webpackConfig({
        devServer: { headers: { 'X-Custom': 'yes' } }
    }).devServer;

    assert.deepEqual(headers, {
        'Access-Control-Allow-Origin': '*',
        'X-Custom': 'yes'
    });
});

test('devServer array headers replace a default of the same key', () => {
    const { headers } = webpackConfig({
        devServer: {
            headers: [{ key: 'Access-Control-Allow-Origin', value: 'https://example.com' }]
        }
    }).devServer;

    assert.deepEqual(headers, [
        { key: 'Access-Control-Allow-Origin', value: 'https://example.com' }
    ]);
});

test('devServer array headers keep defaults they do not override', () => {
    const { headers } = webpackConfig({
        devServer: { headers: [{ key: 'X-Custom', value: 'yes' }] }
    }).devServer;

    assert.deepEqual(headers, [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'X-Custom', value: 'yes' }
    ]);
});

test('a devServer headers function is passed through untouched', () => {
    const headers = () => ({ 'X-Custom': 'yes' });
    const config = webpackConfig({ devServer: { headers } });

    assert.equal(config.devServer.headers, headers);
});

test('babel presets and plugins, with the app-level additions appended', () => {
    const options = babelOptions(webpackConfig());

    assert.deepEqual(options.presets, [
        ['@babel/env', { targets: '> 0.25%, not dead' }],
        '@babel/react'
    ]);
    assert.deepEqual(options.plugins, [
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-object-rest-spread'
    ]);
    assert.deepEqual(options.only, ['src']);

    const custom = babelOptions(
        webpackConfig({
            babelEnvTargets: 'last 2 versions',
            babelPresets: ['@babel/flow'],
            babelPlugins: ['babel-plugin-macros']
        })
    );

    assert.deepEqual(custom.presets[0], ['@babel/env', { targets: 'last 2 versions' }]);
    assert.equal(custom.presets.at(-1), '@babel/flow');
    assert.equal(custom.plugins.at(-1), 'babel-plugin-macros');
});

test('babelOptions merges over the derived options', () => {
    const options = babelOptions(webpackConfig({ babelOptions: { cacheDirectory: false } }));

    assert.equal(options.cacheDirectory, false);
    assert.deepEqual(options.only, ['src'], 'unrelated derived options survive');
});

test('a TypeScript app gets ts-loader, a type checker, and no @babel/typescript', () => {
    const config = webpackConfig();

    assert.ok(pluginNames(config).includes('ForkTsCheckerWebpackPlugin'));

    const tsRule = config.module.rules.find((rule) => rule.loader === 'ts-loader');
    assert.ok(tsRule, 'ts-loader rule is present');
    assert.ok(tsRule.options.configFile.endsWith('/ts-app/tsconfig.json'));

    assert.ok(!babelOptions(config).presets.includes('@babel/typescript'));
    assert.deepEqual(babelOptions(config).presets.length, 2);
});

test('a JavaScript-only app gets no ts-loader, and babel handles TypeScript instead', () => {
    const config = webpackConfig({}, { app: 'js-app' });

    assert.ok(!pluginNames(config).includes('ForkTsCheckerWebpackPlugin'));
    assert.ok(!config.module.rules.some((rule) => rule.loader === 'ts-loader'));

    assert.ok(babelOptions(config).presets.includes('@babel/typescript'));

    const babelRule = config.module.rules.find(
        (rule) => rule.use && rule.use.loader === 'babel-loader'
    );
    assert.equal(String(babelRule.test), String(/\.(jsx?|tsx?)$/));
});

test('an explicit tsconfigPath is honoured', () => {
    const config = webpackConfig({ tsconfigPath: 'custom.tsconfig.json' }, { app: 'custom-ts' });

    const tsRule = config.module.rules.find((rule) => rule.loader === 'ts-loader');
    assert.ok(tsRule.options.configFile.endsWith('/custom-ts/custom.tsconfig.json'));
});

test('an explicit but missing tsconfigPath throws', () => {
    assert.throws(() => webpackConfig({ tsconfigPath: 'nope.json' }), {
        message: /TypeScript config not found:.*nope\.json/
    });
});

test('a missing default tsconfig.json does not throw', () => {
    assert.doesNotThrow(() => webpackConfig({}, { app: 'js-app' }));
});

test('createLibraryConfiguration sets the library and its defaults', () => {
    const config = libraryConfig('MyLib');

    assert.equal(config.output.library, 'MyLib');
    assert.equal(config.output.libraryTarget, 'umd');
    assert.equal(config.output.filename, '[name].js', 'no hashing and no asset path prefix');
    assert.deepEqual(config.optimization.splitChunks, {});
    assert.ok(!pluginNames(config).includes('HtmlWebpackPlugin'), 'html defaults to null');
});

test('createLibraryConfiguration options override the library defaults', () => {
    const config = libraryConfig('MyLib', {
        useHashInFileNames: true,
        output: { libraryTarget: 'commonjs2' }
    });

    assert.equal(config.output.libraryTarget, 'commonjs2');
    assert.equal(config.output.library, 'MyLib', 'the library name is not overridable');
    assert.equal(config.output.filename, '[name].[chunkhash:8].js');
});

test('snapshot: default production config', (t) => {
    t.assert.snapshot(normalize(webpackConfig(), 'ts-app'));
});

test('snapshot: default development config', (t) => {
    t.assert.snapshot(normalize(webpackConfig({}, { mode: 'development' }), 'ts-app'));
});

test('snapshot: JavaScript-only production config', (t) => {
    t.assert.snapshot(normalize(webpackConfig({}, { app: 'js-app' }), 'js-app'));
});

test('snapshot: library config', (t) => {
    t.assert.snapshot(normalize(libraryConfig('MyLib'), 'ts-app'));
});
