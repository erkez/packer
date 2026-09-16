import type { UserConfig } from 'vite' with { 'resolution-mode': 'import' };

export interface AssetPaths {
    js: string;
    css: string;
    static: string;
}

export interface VitePackerOptions extends Omit<
    UserConfig,
    'build' | 'plugins' | 'resolve' | 'server'
> {
    assetPaths?: Partial<AssetPaths>;
    /** Vite entry point relative to the app root. Defaults to `index.html`. */
    entry?: string | Record<string, string>;
    /** Output directory relative to the app root. Defaults to `dist`. */
    outDir?: string;
    useHashInFileNames?: boolean;
    /** Pass `false` to skip Packer's default React plugin. */
    react?: false | Record<string, unknown>;
    plugins?: UserConfig['plugins'];
    resolve?: UserConfig['resolve'];
    server?: UserConfig['server'];
    build?: UserConfig['build'];
    /** Path to tsconfig.json relative to the app root (INIT_CWD). Defaults to `tsconfig.json`. */
    tsconfigPath?: string | undefined;
    /** Pass `false` to disable automatic TypeScript typechecking via `vite-plugin-checker`. Defaults to `true`. */
    typecheck?: boolean;
}
