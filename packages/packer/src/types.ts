import type { Configuration, Entry, Externals, RuleSetRule, WebpackPluginInstance } from 'webpack';

export interface AssetPaths {
    js: string;
    css: string;
    static: string;
}

export interface PackerOutputOptions {
    path?: string;
    publicPath?: string;
    library?: string | string[];
    libraryTarget?: string;
    globalObject?: string;
}

export interface PackerOptions {
    assetPaths?: Partial<AssetPaths>;
    eslint?: Record<string, unknown>;
    devtool?: Configuration['devtool'];
    useHashInFileNames?: boolean;
    enableProgressPlugin?: boolean;
    entry?: Entry;
    output?: PackerOutputOptions;
    splitChunks?: NonNullable<Configuration['optimization']>['splitChunks'];
    target?: Configuration['target'];
    node?: Configuration['node'];
    plugins?: WebpackPluginInstance[];
    loaders?: RuleSetRule[];
    html?: Record<string, unknown> | null;
    resolve?: Configuration['resolve'];
    externals?: Externals;
    provide?: Record<string, string | string[]>;
    define?: Record<string, string | boolean | number>;
    fileExtensions?: string[];
    babelEnvTargets?: string | Record<string, unknown>;
    babelPresets?: unknown[];
    babelPlugins?: unknown[];
    babelOptions?: Record<string, unknown> | undefined;
    terserOptions?: Record<string, unknown> | undefined;
    miniCssExtractPluginOptions?: Record<string, unknown> | undefined;
    devServer?: Record<string, unknown> | undefined;
}

export type ResolvedPackerOptions = Required<
    Pick<
        PackerOptions,
        | 'assetPaths'
        | 'eslint'
        | 'devtool'
        | 'useHashInFileNames'
        | 'enableProgressPlugin'
        | 'entry'
        | 'output'
        | 'splitChunks'
        | 'target'
        | 'plugins'
        | 'loaders'
        | 'html'
        | 'resolve'
        | 'externals'
        | 'provide'
        | 'define'
        | 'fileExtensions'
        | 'babelEnvTargets'
        | 'babelPresets'
        | 'babelPlugins'
    >
> &
    Pick<
        PackerOptions,
        'node' | 'babelOptions' | 'terserOptions' | 'miniCssExtractPluginOptions' | 'devServer'
    > & {
        output: Required<Pick<PackerOutputOptions, 'path' | 'publicPath'>> &
            Pick<PackerOutputOptions, 'library' | 'libraryTarget' | 'globalObject'>;
        assetPaths: AssetPaths;
    };

export type WebpackArgv = {
    mode?: 'development' | 'production' | string;
};

export type WebpackConfigFactory = (env: unknown, argv: WebpackArgv) => Configuration;
