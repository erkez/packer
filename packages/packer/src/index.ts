import * as webpack from '@ekz/packer-webpack';
import * as vite from '@ekz/packer-vite';

export { vite, webpack };
export type {
    AssetPaths,
    PackerOptions,
    PackerOutputOptions,
    WebpackArgv,
    WebpackConfigFactory
} from '@ekz/packer-webpack';
export type { VitePackerOptions } from '@ekz/packer-vite';
