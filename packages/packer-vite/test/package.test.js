'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { builtinModules } = require('node:module');
const path = require('node:path');
const { test } = require('node:test');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const DIST = path.join(PACKAGE_ROOT, 'dist');

const manifest = require('../package.json');

const REQUIRE_CALL = /\b(?:node)?[Rr]equire\(\s*["']([^"']+)["']\s*\)/g;

function packageName(request) {
    const segments = request.split('/');
    return request.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0];
}

function requiredPackages() {
    const requests = new Set();

    for (const entry of fs.readdirSync(DIST)) {
        if (!entry.endsWith('.js')) {
            continue;
        }

        const source = fs.readFileSync(path.join(DIST, entry), 'utf8');

        for (const [, request] of source.matchAll(REQUIRE_CALL)) {
            if (request.startsWith('.') || builtinModules.includes(request.replace(/^node:/, ''))) {
                continue;
            }

            requests.add(packageName(request));
        }
    }

    return [...requests].sort();
}

test('every package the build requires is declared', () => {
    const declared = new Set([
        ...Object.keys(manifest.dependencies),
        ...Object.keys(manifest.peerDependencies)
    ]);

    const undeclared = requiredPackages().filter((name) => !declared.has(name));

    assert.deepEqual(undeclared, []);
});
