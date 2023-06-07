const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { ProgressPlugin, ProvidePlugin, DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function createApplicationConfiguration(opts) {
    const options = Object.assign({}, DefaultOptions, opts);

    return function configure(env, argv) {
        const isProduction = argv.mode === 'production';

        const pathResolvers = makePathResolvers(
            Object.assign({}, DefaultOptions.assetPaths, options.assetPaths)
        );

        const typescriptConfigPath = path.resolve(process.env.INIT_CWD, 'tsconfig.json');

        return {
            mode: argv.mode,
            entry: options.entry,
            devtool: isProduction ? undefined : options.devtool,
            target: options.target,
            node: options.node,
            output: {
                path: path.resolve(
                    process.env.INIT_CWD,
                    options.output.path || DefaultOptions.output.path
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
                ].concat(options.plugins)
            ),
            resolve: Object.assign(
                {
                    alias: Object.assign(
                        {
                            '@root': path.resolve(process.env.INIT_CWD, 'src')
                        },
                        options.resolve.alias
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
                                                '@babel/flow',
                                                '@babel/react',
                                                '@babel/typescript'
                                            ].concat(options.babelPresets)
                                        ),
                                        plugins: truthyArray(
                                            [
                                                '@babel/proposal-class-properties',
                                                '@babel/proposal-object-rest-spread'
                                            ].concat(options.babelPlugins)
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
                            test: /\.(woff|woff2|ttf|eot|svg|png|jpg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                            loader: 'file-loader',
                            options: {
                                outputPath: pathResolvers.staticAsset(''),
                                name: options.useHashInFileNames
                                    ? '[name].[contenthash:8].[ext]'
                                    : '[name].[ext]'
                            }
                        },
                        {
                            test: /\.(css|s[ac]ss)$/i,
                            use: [
                                {
                                    loader: MiniCssExtractPlugin.loader
                                },
                                'css-loader',
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        postcssOptions: {
                                            path: __dirname
                                        }
                                    }
                                },
                                'sass-loader'
                            ]
                        }
                    ].concat(options.loaders)
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

function createLibraryConfiguration(libraryName, opts = {}) {
    const output = Object.assign({}, DefaultOptions.output, DefaultLibOptions.output, opts.output, {
        library: libraryName
    });
    return createApplicationConfiguration(Object.assign({}, DefaultLibOptions, opts, { output }));
}

const DefaultOptions = {
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
    miniCssExtractPluginOptions: undefined
};

const DefaultLibOptions = {
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

function hasModule(path) {
    try {
        require.resolve(path);
        return true;
    } catch (e) {
        // module not found
        return false;
    }
}

function truthyArray(array) {
    return array.filter((item) => item != null && item !== false);
}

function makePathResolvers(config) {
    return {
        jsAsset(value) {
            return path.join(config.js, value);
        },
        cssAsset(value) {
            return path.join(config.css, value);
        },
        staticAsset(value) {
            return path.join(config.static, value);
        }
    };
}

module.exports.createApplicationConfiguration = createApplicationConfiguration;

module.exports.createLibraryConfiguration = createLibraryConfiguration;
