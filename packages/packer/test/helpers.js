'use strict';

const path = require('path');

const packer = require('../dist/index.js');

const FIXTURES = path.join(__dirname, 'fixtures');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

function fixture(name) {
    return path.join(FIXTURES, name);
}

/**
 * Both factories resolve paths against INIT_CWD, which yarn sets but `node --test` does not.
 * Webpack throws without it; vite silently falls back to process.cwd() and picks up packer's own
 * tsconfig.json, so every test must pin it explicitly rather than rely on a default.
 */
function withInitCwd(name, run) {
    const previous = process.env.INIT_CWD;
    process.env.INIT_CWD = fixture(name);

    try {
        return run();
    } finally {
        if (previous === undefined) {
            delete process.env.INIT_CWD;
        } else {
            process.env.INIT_CWD = previous;
        }
    }
}

function webpackConfig(opts = {}, { mode = 'production', app = 'ts-app' } = {}) {
    return withInitCwd(app, () =>
        packer.webpack.createApplicationConfiguration(opts)(null, { mode })
    );
}

function libraryConfig(name, opts = {}, { mode = 'production', app = 'ts-app' } = {}) {
    return withInitCwd(app, () =>
        packer.webpack.createLibraryConfiguration(name, opts)(null, { mode })
    );
}

function viteConfig(opts = {}, { app = 'ts-app' } = {}) {
    return withInitCwd(app, () => packer.vite.createApplicationConfiguration(opts));
}

function pluginNames(config) {
    return config.plugins.map((plugin) => plugin.constructor.name);
}

function findPlugin(config, name) {
    return config.plugins.find((plugin) => plugin.constructor.name === name);
}

function vitePluginNames(config) {
    return config.plugins
        .flat(Infinity)
        .filter(Boolean)
        .map((plugin) => plugin.name);
}

function babelOptions(config) {
    return config.module.rules.find((rule) => rule.use && rule.use.loader === 'babel-loader').use
        .options;
}

/**
 * Snapshots of the raw config are not portable: it embeds absolute INIT_CWD and node_modules paths,
 * live plugin instances, functions and regexes. Project it onto something stable — absolute paths
 * become tokens, plugins become their constructor name — so a snapshot pins Packer's own output
 * rather than the internals of whichever plugin version happens to be installed.
 */
function normalize(value, app) {
    const root = fixture(app);

    function walk(node) {
        if (node == null || typeof node === 'boolean' || typeof node === 'number') {
            return node;
        }

        if (typeof node === 'string') {
            return node.split(root).join('<root>').split(REPO_ROOT).join('<repo>');
        }

        if (typeof node === 'function') {
            return '[Function]';
        }

        if (node instanceof RegExp) {
            return String(node);
        }

        if (Array.isArray(node)) {
            return node.map(walk);
        }

        if (node.constructor && node.constructor !== Object) {
            return `[${node.constructor.name}]`;
        }

        return Object.fromEntries(
            Object.entries(node)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, item]) => [key, walk(item)])
        );
    }

    return walk(value);
}

module.exports = {
    babelOptions,
    findPlugin,
    fixture,
    libraryConfig,
    normalize,
    pluginNames,
    viteConfig,
    vitePluginNames,
    webpackConfig,
    withInitCwd
};
