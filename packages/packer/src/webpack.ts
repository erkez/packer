import path from 'path';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { ProgressPlugin, ProvidePlugin, DefinePlugin } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import type { Configuration } from 'webpack';

import type {
    AssetPaths,
    PackerOptions,
    ResolvedPackerOptions,
    WebpackConfigFactory
} from './types';

function createApplicationConfiguration(opts: PackerOptions = {}): WebpackConfigFactory {
    const options = Object.assign({}, DefaultOptions, opts) as ResolvedPackerOptions;

    return function configure(_env, argv) {
        const isProduction = argv.mode === 'production';

        const pathResolvers = makePathResolvers(
            Object.assign({}, DefaultOptions.assetPaths, options.assetPaths)
        );

        const typescriptConfigPath = resolveTypeScriptConfigPath(
            options.tsconfigPath,
            process.env.INIT_CWD!
        );
        const hasTypeScript = typescriptConfigPath != null;

        return {
            mode: argv.mode as 'development' | 'production' | undefined,
            entry: options.entry,
            devtool: isProduction ? undefined : options.devtool,
            cache: {
                type: 'filesystem',
                cacheDirectory: path.resolve(process.env.INIT_CWD!, 'node_modules/.cache/webpack')
            },
            target: options.target,
            node: options.node,
            output: {
                path: path.resolve(
                    process.env.INIT_CWD!,
                    options.output.path || DefaultOptions.output.path
                ),
                assetModuleFilename: pathResolvers.staticAsset(
                    isProduction && options.useHashInFileNames
                        ? '[name].[hash:8][ext][query]'
                        : '[name][ext][query]'
                ),
                library: options.output.library || DefaultOptions.output.library,
                libraryTarget: options.output.libraryTarget || DefaultOptions.output.libraryTarget,
                publicPath: options.output.publicPath || DefaultOptions.output.publicPath,
                globalObject: options.output.globalObject,
                filename: pathResolvers.jsAsset(
                    isProduction && options.useHashInFileNames
                        ? '[name].[chunkhash:8].js'
                        : '[name].js'
                ),
                chunkFilename: pathResolvers.jsAsset(
                    isProduction && options.useHashInFileNames ? '[id].[chunkhash:8].js' : '[id].js'
                )
            },
            plugins: truthyArray(
                [
                    new ESLintPlugin(
                        Object.assign(
                            {
                                extensions: ['js', 'jsx', 'ts', 'tsx'],
                                failOnError: isProduction,
                                failOnWarning: isProduction,
                                emitWarning: !isProduction,
                                lintDirtyModulesOnly: !isProduction
                            },
                            options.eslint
                        )
                    ),
                    options.enableProgressPlugin && new ProgressPlugin(),
                    new CleanWebpackPlugin(),
                    hasTypeScript
                        ? new ForkTsCheckerWebpackPlugin({
                              typescript: {
                                  configFile: typescriptConfigPath
                              }
                          })
                        : null,
                    new ProvidePlugin(options.provide),
                    new DefinePlugin(options.define),
                    options.html != null && new HtmlWebpackPlugin(options.html),
                    new MiniCssExtractPlugin(
                        Object.assign(
                            {
                                filename: pathResolvers.cssAsset(
                                    isProduction && options.useHashInFileNames
                                        ? '[name].[chunkhash:8].css'
                                        : '[name].css'
                                )
                            },
                            options.miniCssExtractPluginOptions
                        )
                    )
                ].concat(options.plugins as [])
            ),
            resolve: Object.assign({ extensions: options.fileExtensions }, options.resolve, {
                alias: mergeAlias(
                    { '@root': path.resolve(process.env.INIT_CWD!, 'src') },
                    options.resolve?.alias
                )
            }),
            externals: options.externals,
            module: {
                rules: truthyArray(
                    [
                        hasTypeScript && {
                            test: /\.tsx?$/,
                            exclude: /node_modules/,
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true,
                                configFile: typescriptConfigPath
                            }
                        },
                        {
                            test: hasTypeScript ? /\.jsx?$/ : /\.(jsx?|tsx?)$/,
                            exclude: /node_modules/,
                            use: {
                                loader: 'babel-loader',
                                options: createBabelLoaderOptions(options, !hasTypeScript)
                            }
                        },
                        {
                            test: /\.node$/,
                            loader: 'node-loader'
                        },
                        {
                            test: /\.(css|s[ac]ss)$/i,
                            use: [
                                {
                                    loader: MiniCssExtractPlugin.loader
                                },
                                'css-loader',
                                'sass-loader'
                            ]
                        },
                        {
                            test: /\.(woff|woff2|ttf|eot|svg|png|jpg|gif|ico)(\?\w+)?$/,
                            type: 'asset/resource'
                        }
                    ].concat(options.loaders as [])
                )
            },
            optimization: {
                minimize: isProduction,
                minimizer: [new TerserPlugin(options.terserOptions)],
                splitChunks: options.splitChunks
            },
            devServer: Object.assign(
                {
                    port: 9000,
                    compress: true,
                    hot: true
                },
                options.devServer,
                {
                    headers: mergeHeaders(
                        { 'Access-Control-Allow-Origin': '*' },
                        options.devServer?.headers
                    )
                }
            )
        };
    };
}

function createLibraryConfiguration(
    libraryName: string,
    opts: PackerOptions = {}
): WebpackConfigFactory {
    const output = Object.assign({}, DefaultOptions.output, DefaultLibOptions.output, opts.output, {
        library: libraryName
    });
    return createApplicationConfiguration(Object.assign({}, DefaultLibOptions, opts, { output }));
}

const DefaultOptions: ResolvedPackerOptions = {
    assetPaths: {
        js: 'assets/js/',
        css: 'assets/css/',
        static: 'assets/static/'
    },
    eslint: {},
    devtool: 'eval-cheap-module-source-map',
    useHashInFileNames: true,
    enableProgressPlugin: true,
    entry: {
        main: './src/index.js'
    },
    output: {
        path: 'dist',
        publicPath: '/',
        library: undefined,
        libraryTarget: undefined
    },
    splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.'
    },
    target: 'web',
    plugins: [],
    loaders: [],
    html: {},
    resolve: {},
    externals: {},
    provide: {},
    define: {},
    fileExtensions: ['.js', '.jsx', '.ts', '.tsx'],
    babelEnvTargets: '> 0.25%, not dead',
    babelPresets: [],
    babelPlugins: [],
    babelOptions: undefined,
    terserOptions: undefined,
    miniCssExtractPluginOptions: undefined,
    devServer: undefined,
    tsconfigPath: undefined
};

const DefaultLibOptions: PackerOptions = {
    useHashInFileNames: false,
    output: {
        libraryTarget: 'umd'
    },
    assetPaths: {
        js: '',
        css: '',
        static: ''
    },
    splitChunks: {},
    html: null
};

function createBabelLoaderOptions(
    options: ResolvedPackerOptions,
    includeTypeScriptPreset: boolean
): Record<string, unknown> {
    return Object.assign(
        {
            presets: truthyArray(
                [
                    [
                        '@babel/env',
                        {
                            targets: options.babelEnvTargets
                        }
                    ],
                    '@babel/react',
                    includeTypeScriptPreset && '@babel/typescript'
                ].concat(options.babelPresets as [])
            ),
            plugins: truthyArray(
                [
                    '@babel/plugin-transform-class-properties',
                    '@babel/plugin-transform-object-rest-spread'
                ].concat(options.babelPlugins as string[])
            ),
            only: ['src'],
            cacheDirectory: true,
            cacheCompression: false
        },
        options.babelOptions
    );
}

function resolveTypeScriptConfigPath(tsconfigPath: string | undefined, cwd: string): string | null {
    const explicit = tsconfigPath != null;
    const configPath = path.resolve(cwd, tsconfigPath ?? 'tsconfig.json');

    if (hasModule(configPath)) {
        return configPath;
    }

    if (explicit) {
        throw new Error(`TypeScript config not found: ${configPath}`);
    }

    return null;
}

function hasModule(modulePath: string): boolean {
    try {
        require.resolve(modulePath);
        return true;
    } catch {
        return false;
    }
}

function truthyArray<T>(array: (T | false | null | undefined)[]): T[] {
    return array.filter((item): item is T => item != null && item !== false);
}

type ResolveAlias = NonNullable<Configuration['resolve']>['alias'];

function mergeAlias(defaults: Record<string, string>, alias: ResolveAlias): ResolveAlias {
    if (alias == null) {
        return defaults;
    }

    if (Array.isArray(alias)) {
        return alias.concat(
            Object.entries(defaults).map(([name, aliasPath]) => ({ name, alias: aliasPath }))
        );
    }

    return Object.assign({}, defaults, alias);
}

type DevServerHeader = { key: string; value: string };

function mergeHeaders(defaults: Record<string, string>, headers: unknown): unknown {
    if (headers == null) {
        return defaults;
    }

    if (Array.isArray(headers)) {
        const overridden = new Set((headers as DevServerHeader[]).map((header) => header.key));

        return Object.entries(defaults)
            .filter(([key]) => !overridden.has(key))
            .map(([key, value]): DevServerHeader => ({ key, value }))
            .concat(headers as DevServerHeader[]);
    }

    if (typeof headers === 'function') {
        return headers;
    }

    return Object.assign({}, defaults, headers);
}

function makePathResolvers(config: AssetPaths) {
    return {
        jsAsset(value: string) {
            return path.join(config.js, value);
        },
        cssAsset(value: string) {
            return path.join(config.css, value);
        },
        staticAsset(value: string) {
            return path.join(config.static, value);
        }
    };
}

export { createApplicationConfiguration, createLibraryConfiguration };
