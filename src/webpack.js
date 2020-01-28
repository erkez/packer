const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { ProgressPlugin, ProvidePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function createApplicationConfiguration(opts) {
    const options = Object.assign({}, DefaultOptions, opts);

    return function configure(env, argv) {
        const isProduction = argv.mode === 'production';

        const typescriptPath = path.resolve(process.env.INIT_CWD, 'node_modules/typescript');

        return {
            mode: argv.mode,
            entry: options.entry,
            devtool: isProduction ? undefined : 'source-map',
            output: {
                path: path.resolve(
                    process.env.INIT_CWD,
                    options.output.path || DefaultOptions.output.path
                ),
                publicPath: options.output.publicPath || DefaultOptions.output.publicPath,
                filename: isProduction ? 'assets/js/[name].[chunkhash:8].js' : 'assets/js/[name].js'
            },
            plugins: [
                new ProgressPlugin(),
                new CleanWebpackPlugin(),
                hasModule(typescriptPath)
                    ? new ForkTsCheckerWebpackPlugin({
                          typescript: path.resolve(process.env.INIT_CWD, 'node_modules/typescript')
                      })
                    : null,
                new ProvidePlugin(options.provide),
                new HtmlWebpackPlugin(options.html),
                new MiniCssExtractPlugin({
                    filename: isProduction
                        ? 'assets/css/[name].[chunkhash:8].css'
                        : 'assets/css/[name].css'
                })
            ]
                .concat(options.plugins)
                .filter(plugin => plugin != null && plugin !== false),
            resolve: {
                alias: Object.assign(
                    {
                        '@root': path.resolve(process.env.INIT_CWD, 'src')
                    },
                    options.resolve.alias
                ),
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            },
            externals: options.externals,
            module: {
                rules: [
                    {
                        enforce: 'pre',
                        test: /\.(jsx?|tsx?)$/,
                        exclude: /node_modules/,
                        loader: 'eslint-loader',
                        options: {
                            failOnError: isProduction,
                            failOnWarning: isProduction,
                            emitWarning: !isProduction
                        }
                    },
                    {
                        test: /\.(js|jsx)$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/env',
                                        {
                                            targets: '> 0.25%, not dead'
                                        }
                                    ],
                                    '@babel/flow',
                                    '@babel/react'
                                ],
                                only: ['src']
                            }
                        }
                    },
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true
                        }
                    },
                    {
                        test: /\.(woff|woff2|ttf|eot|svg|png|jpg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/static/'
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
                                    config: {
                                        path: __dirname
                                    }
                                }
                            },
                            'sass-loader'
                        ]
                    }
                ].concat(options.loaders)
            },
            optimization: {
                minimize: isProduction,
                minimizer: [new TerserPlugin()],
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        vendors: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'common',
                            chunks: 'all'
                        }
                    }
                }
            },
            devServer: Object.assign(
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    port: 9000,
                    compress: true,
                    hot: true,
                    overlay: true
                },
                options.devServer
            )
        };
    };
}

const DefaultOptions = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: 'dist',
        publicPath: '/'
    },
    plugins: [],
    loaders: [],
    html: {},
    resolve: {},
    externals: {},
    provide: {}
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

module.exports.createApplicationConfiguration = createApplicationConfiguration;
