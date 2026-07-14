'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { normalize, viteConfig, vitePluginNames } = require('./helpers');

function assetFileNames(config) {
    return config.build.rollupOptions.output.assetFileNames;
}

test('root resolves against INIT_CWD, and @root aliases its src directory', () => {
    const config = viteConfig();

    assert.ok(config.root.endsWith('/ts-app'));
    assert.ok(config.resolve.alias['@root'].endsWith('/ts-app/src'));
});

test('root option is resolved relative to INIT_CWD', () => {
    const config = viteConfig({ root: 'app' });

    assert.ok(config.root.endsWith('/ts-app/app'));
    assert.ok(config.resolve.alias['@root'].endsWith('/ts-app/app/src'));
});

test('default plugins are react and the type checker', () => {
    const names = vitePluginNames(viteConfig());

    assert.ok(
        names.some((name) => name.startsWith('vite:react')),
        'react plugin is present'
    );
    assert.ok(names.includes('vite-plugin-checker'));
});

test('react: false drops the react plugin', () => {
    const names = vitePluginNames(viteConfig({ react: false }));

    assert.ok(!names.some((name) => name.startsWith('vite:react')));
    assert.ok(names.includes('vite-plugin-checker'), 'the checker is unaffected');
});

test('typecheck: false drops the checker plugin', () => {
    const names = vitePluginNames(viteConfig({ typecheck: false }));

    assert.ok(!names.includes('vite-plugin-checker'));
    assert.ok(
        names.some((name) => name.startsWith('vite:react')),
        'react is unaffected'
    );
});

test('an app with no tsconfig.json gets no checker, without throwing', () => {
    const names = vitePluginNames(viteConfig({}, { app: 'js-app' }));

    assert.ok(!names.includes('vite-plugin-checker'));
});

test('custom plugins are appended to the defaults', () => {
    const plugin = { name: 'my-plugin' };
    const names = vitePluginNames(viteConfig({ plugins: [plugin] }));

    assert.equal(names.at(-1), 'my-plugin');
    assert.ok(names.includes('vite-plugin-checker'), 'defaults are kept');
});

test('server defaults, and user options merge over them', () => {
    const defaults = viteConfig().server;

    assert.equal(defaults.port, 9000);
    assert.deepEqual(defaults.headers, { 'Access-Control-Allow-Origin': '*' });

    const custom = viteConfig({ server: { port: 3000 } }).server;
    assert.equal(custom.port, 3000);
    assert.deepEqual(
        custom.headers,
        { 'Access-Control-Allow-Origin': '*' },
        'the CORS default survives'
    );
});

test('resolve options merge with the @root alias', () => {
    const config = viteConfig({ resolve: { alias: { '@ui': '/ui' } } });

    assert.equal(config.resolve.alias['@ui'], '/ui');
    assert.ok(config.resolve.alias['@root'].endsWith('/ts-app/src'));
});

test('outDir defaults to dist and is overridable', () => {
    assert.equal(viteConfig().build.outDir, 'dist');
    assert.equal(viteConfig({ outDir: 'build' }).build.outDir, 'build');
});

test('a string entry resolves to an absolute path', () => {
    const input = viteConfig().build.rollupOptions.input;
    assert.ok(input.endsWith('/ts-app/index.html'));

    const custom = viteConfig({ entry: 'src/main.tsx' }).build.rollupOptions.input;
    assert.ok(custom.endsWith('/ts-app/src/main.tsx'));
});

test('a record entry resolves each path, preserving the keys', () => {
    const input = viteConfig({
        entry: { app: 'src/app.tsx', admin: 'src/admin.tsx' }
    }).build.rollupOptions.input;

    assert.deepEqual(Object.keys(input), ['app', 'admin']);
    assert.ok(input.app.endsWith('/ts-app/src/app.tsx'));
    assert.ok(input.admin.endsWith('/ts-app/src/admin.tsx'));
});

test('build options merge over the derived rollup config', () => {
    const config = viteConfig({ build: { sourcemap: true } });

    assert.equal(config.build.sourcemap, true);
    assert.equal(config.build.outDir, 'dist', 'derived options survive');
    assert.ok(config.build.rollupOptions.input, 'the entry survives');
});

test('js chunk and entry filenames are hashed by default', () => {
    const { output } = viteConfig().build.rollupOptions;

    assert.equal(output.entryFileNames, 'assets/js/[name]-[hash].js');
    assert.equal(output.chunkFileNames, 'assets/js/[name]-[hash].js');
});

test('useHashInFileNames: false removes the hash', () => {
    const { output } = viteConfig({ useHashInFileNames: false }).build.rollupOptions;

    assert.equal(output.entryFileNames, 'assets/js/[name].js');
    assert.equal(output.chunkFileNames, 'assets/js/[name].js');
});

test('assetFileNames routes css and other assets to their own paths', () => {
    const names = assetFileNames(viteConfig());

    assert.equal(
        names({ names: ['style.css'], originalFileNames: [] }),
        'assets/css/[name]-[hash][extname]'
    );
    assert.equal(
        names({ names: ['logo.png'], originalFileNames: [] }),
        'assets/static/[name]-[hash][extname]'
    );
});

test('assetFileNames falls back to originalFileNames, then to the static path', () => {
    const names = assetFileNames(viteConfig());

    assert.equal(
        names({ names: [], originalFileNames: ['style.css'] }),
        'assets/css/[name]-[hash][extname]'
    );
    assert.equal(
        names({ names: [], originalFileNames: [] }),
        'assets/static/[name]-[hash][extname]'
    );
});

test('assetFileNames honours assetPaths and useHashInFileNames', () => {
    const names = assetFileNames(
        viteConfig({
            assetPaths: { css: 'styles/' },
            useHashInFileNames: false
        })
    );

    assert.equal(names({ names: ['style.css'], originalFileNames: [] }), 'styles/[name][extname]');
    assert.equal(
        names({ names: ['logo.png'], originalFileNames: [] }),
        'assets/static/[name][extname]',
        'static keeps its default'
    );
});

test('an explicit tsconfigPath is honoured', () => {
    const names = vitePluginNames(
        viteConfig({ tsconfigPath: 'custom.tsconfig.json' }, { app: 'custom-ts' })
    );

    assert.ok(names.includes('vite-plugin-checker'));
});

test('an explicit but missing tsconfigPath throws', () => {
    assert.throws(() => viteConfig({ tsconfigPath: 'nope.json' }), {
        message: /TypeScript config not found:.*nope\.json/
    });
});

test('unknown vite options are merged into the config', () => {
    const config = viteConfig({ base: '/app/', envPrefix: 'APP_' });

    assert.equal(config.base, '/app/');
    assert.equal(config.envPrefix, 'APP_');
});

test('snapshot: default config', (t) => {
    t.assert.snapshot(normalize(viteConfig(), 'ts-app'));
});

test('snapshot: config without react or typechecking', (t) => {
    t.assert.snapshot(normalize(viteConfig({ react: false, typecheck: false }), 'ts-app'));
});
