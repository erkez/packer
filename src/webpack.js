const path = require('path');

const { ProgressPlugin, ProvidePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function createApplicationConfiguration(opts) {
    const options = Object.assign({}, DefaultOptions, opts);

    return function configure(env, argv) {
        const isProduction = argv.mode === 'production';

        return {
            mode: argv.mode,
            entry: options.entry,
            output: {
                path: path.resolve(process.env.INIT_CWD, 'dist'),
                publicPath: options.output.publicPath,
                filename: isProduction ? 'assets/js/[name].[chunkhash:8].js' : 'assets/js/[name].js'
            },
            plugins: [
                new ProgressPlugin(),
                new CleanWebpackPlugin(),
                new ProvidePlugin(options.provide),
                new HtmlWebpackPlugin(options.html),
                new MiniCssExtractPlugin({
                    filename: isProduction
                        ? 'assets/css/[name].[chunkhash:8].css'
                        : 'assets/css/[name].css'
                })
            ],
            resolve: {
                alias: Object.assign(
                    {
                        '@root': path.resolve(process.env.INIT_CWD, 'src')
                    },
                    options.resolve.alias
                )
            },
            externals: options.externals,
            module: {
                rules: [
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
                ]
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
        publicPath: '/'
    },
    html: {
        template: 'public/index.html',
        filename: 'index.html'
    },
    resolve: {},
    externals: {},
    provide: {}
};

module.exports.createApplicationConfiguration = createApplicationConfiguration;
