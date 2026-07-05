import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command) {
    execSync(command, { cwd: root, env: process.env, stdio: 'inherit' });
}

function getDistTag() {
    const prePath = path.join(root, '.changeset', 'pre.json');

    if (!existsSync(prePath)) {
        return 'latest';
    }

    const pre = JSON.parse(readFileSync(prePath, 'utf8'));

    return pre.mode === 'pre' ? pre.tag : 'latest';
}

const distTag = getDistTag();
const publishFlags = [
    '--access',
    'public',
    '--tolerate-republish',
    '--provenance',
    ...(distTag === 'latest' ? [] : ['--tag', distTag])
].join(' ');

run('yarn build');

for (const workspace of ['@ekz/eslint-config-packer', '@ekz/packer']) {
    run(`yarn workspace ${workspace} npm publish ${publishFlags}`);
}

run('yarn changeset tag');
