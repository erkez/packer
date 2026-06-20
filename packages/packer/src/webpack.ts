import path from 'path';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { ProgressPlugin, ProvidePlugin, DefinePlugin } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

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

        const typescriptConfigPath = path.resolve(process.env.INIT_CWD!, 'tsconfig.json');

        return {
            mode: argv.mode as 'development' | 'production' | undefined,
            entry: options.entry,
            devtool: isProduction ? undefined : options.devtool,
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
                                emitWarning: !isProduction
                            },
                            options.eslint
                        )
                    ),
                    options.enableProgressPlugin && new ProgressPlugin(),
                    new CleanWebpackPlugin(),
                    hasModule(typescriptConfigPath) ? new ForkTsCheckerWebpackPlugin() : null,
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
            resolve: Object.assign(
                {
                    alias: Object.assign(
                        {
                            '@root': path.resolve(process.env.INIT_CWD!, 'src')
                        },
                        options.resolve?.alias
                    ),
                    extensions: options.fileExtensions
                },
                options.resolve
            ),
            externals: options.externals,
            module: {
                rules: truthyArray(
                    [
                        typescriptConfigPath && {
                            test: /\.tsx?$/,
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true
                            }
                        },
                        {
                            test: /\.(jsx?|tsx?)$/,
                            use: {
                                loader: 'babel-loader',
                                options: Object.assign(
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
                                                '@babel/typescript'
                                            ].concat(options.babelPresets as [])
                                        ),
                                        plugins: truthyArray(
                                            [
                                                '@babel/plugin-transform-class-properties',
                                                '@babel/plugin-transform-object-rest-spread'
                                            ].concat(options.babelPlugins as string[])
                                        ),
                                        only: ['src']
                                    },
                                    options.babelOptions
                                )
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
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    port: 9000,
                    compress: true,
                    hot: true
                },
                options.devServer
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
    devtool: 'source-map',
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
    devServer: undefined
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
