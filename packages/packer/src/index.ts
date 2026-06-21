import * as webpack from './webpack';
import * as vite from './vite';

export { vite, webpack };
export type {
    AssetPaths,
    PackerOptions,
    PackerOutputOptions,
    VitePackerOptions,
    WebpackArgv,
    WebpackConfigFactory
} from './types';
