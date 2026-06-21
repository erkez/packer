import { createRequire } from 'node:module';
import path from 'path';

import type { UserConfig } from 'vite' with { 'resolution-mode': 'import' };

import type { AssetPaths, VitePackerOptions } from './types';

const nodeRequire = createRequire(__filename);

function createApplicationConfiguration(opts: VitePackerOptions = {}): UserConfig {
    const { defineConfig, mergeConfig } = nodeRequire('vite') as typeof import('vite', {
        with: { 'resolution-mode': 'import' }
    });
    const reactPluginModule = nodeRequire('@vitejs/plugin-react') as typeof import(
        '@vitejs/plugin-react',
        {
            with: { 'resolution-mode': 'import' }
        }
    );
    const reactPlugin = reactPluginModule.default;

    const {
        assetPaths,
        build,
        entry = 'index.html',
        outDir = 'dist',
        plugins = [],
        react = {},
        resolve,
        root = '.',
        server,
        useHashInFileNames = true,
        ...viteOptions
    } = opts;

    const appRoot = path.resolve(process.env.INIT_CWD ?? process.cwd(), root);
    const resolvedAssetPaths = Object.assign({}, DefaultAssetPaths, assetPaths);

    const defaultConfig: UserConfig = {
        root: appRoot,
        plugins: truthyArray([react !== false && reactPlugin(react), ...asArray(plugins)]),
        resolve: Object.assign(
            {
                alias: Object.assign(
                    {
                        '@root': path.resolve(appRoot, 'src')
                    },
                    resolve?.alias
                )
            },
            resolve
        ),
        server: Object.assign(
            {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                port: 9000
            },
            server
        ),
        build: mergeConfig(
            {
                outDir,
                rollupOptions: {
                    input: resolveEntry(appRoot, entry),
                    output: {
                        entryFileNames: jsFileName(resolvedAssetPaths.js, useHashInFileNames),
                        chunkFileNames: jsFileName(resolvedAssetPaths.js, useHashInFileNames),
                        assetFileNames(assetInfo: {
                            names: string[];
                            originalFileNames: string[];
                        }) {
                            const name = assetInfo.names[0] ?? assetInfo.originalFileNames[0] ?? '';
                            const assetPath = name.endsWith('.css')
                                ? resolvedAssetPaths.css
                                : resolvedAssetPaths.static;

                            return fileName(assetPath, useHashInFileNames);
                        }
                    }
                }
            },
            build ?? {}
        ) as UserConfig['build']
    };

    return defineConfig(mergeConfig(defaultConfig, viteOptions));
}

const DefaultAssetPaths: AssetPaths = {
    js: 'assets/js/',
    css: 'assets/css/',
    static: 'assets/static/'
};

function resolveEntry(appRoot: string, entry: string | Record<string, string>) {
    if (typeof entry === 'string') {
        return path.resolve(appRoot, entry);
    }

    return Object.fromEntries(
        Object.entries(entry).map(([name, value]) => [name, path.resolve(appRoot, value)])
    );
}

function fileName(assetPath: string, useHash: boolean): string {
    return path.join(assetPath, useHash ? '[name]-[hash][extname]' : '[name][extname]');
}

function jsFileName(assetPath: string, useHash: boolean): string {
    return path.join(assetPath, useHash ? '[name]-[hash].js' : '[name].js');
}

function asArray<T>(value: T | T[] | undefined): T[] {
    if (value == null) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
}

function truthyArray<T>(array: (T | false | null | undefined)[]): T[] {
    return array.filter((item): item is T => item != null && item !== false);
}

export { createApplicationConfiguration };
