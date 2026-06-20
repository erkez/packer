---
name: packer-monorepo
description: >-
  Work in the @ekz/packer Yarn monorepo: workspace layout, library build,
  examples integration, and release conventions. Use when changing packages/*,
  examples/*, or root workspace config.
---

# Packer monorepo

## Layout

```
packages/packer/               @ekz/packer — TypeScript → dist/
packages/eslint-config-packer/ shared ESLint flat configs
examples/typescript/           my-app — integration test + copyable starter
```

Workspaces: `packages/*`, `examples/*`. One root `yarn.lock`.

## Library

- Source: `packages/packer/src/` · publish: `dist/` (`yarn build` / `prepare`)
- API: `Packer.webpack.createApplicationConfiguration()` / `createLibraryConfiguration()`
- Also exports `./recommended`, `./typescript`, `./tsconfig/*`
- Node `>=24` (`.nvmrc` in repo root and each example)

```sh
yarn install && yarn dedupe   # after adding deps; commit yarn.lock
yarn install:ci               # CI equivalent: immutable install + dedupe --check
yarn workspace @ekz/packer build
yarn workspace @ekz/packer lint
yarn workspace my-app lint   # when webpack or eslint surface changes
```

## Examples

Dual purpose: `workspace:^` in-repo; users copy out and pin `"@ekz/packer": "^x.y.z"`. Details in `examples/typescript/README.md`.

Do not add nested `yarn.lock` or `bin/setup-node` — use `.nvmrc` + `nvm use`.

## CI and release

- **CI** (`.github/workflows/ci.yml`): on PR/push — `yarn build`, `yarn lint`, `yarn docs:build`, `my-app build:prod`
- **Dependency review** (`.github/workflows/dependency-review.yml`): blocks PRs that add high/critical vulnerabilities
- **Dependabot** (`.github/dependabot.yml`): weekly npm + GitHub Actions updates (root lockfile only)
- **Docs** (`.github/workflows/docs.yml`): Docusaurus → GitHub Pages at `https://packer.ekz.io/` (custom domain; `docs/static/CNAME`)
- **Release** (`.github/workflows/release.yml`): Changesets on `master` → version PR or npm publish
- Packages are **fixed** in `.changeset/config.json` — they always share a version
- Requires **npm trusted publishing** configured on npmjs.com for `@ekz/packer` and `@ekz/eslint-config-packer` (GitHub Actions → repo `erkez/packer`, workflow **`release.yml`** — filename must match exactly)
- No `NPM_TOKEN` — publish uses OIDC (`id-token: write` in release workflow)
- **Pre-release**: repo is in Changesets `beta` mode (`.changeset/pre.json`) — publishes `@beta`, not `latest`
- **GA 1.0.0**: run `yarn changeset pre exit`, add changeset if needed, merge release PR → `latest`

Contributor flow: `yarn changeset` → PR → merge → release PR merges → npm publish (beta tag while in pre mode).

Consumer-facing changelog and migration notes go in `packages/packer/README.md`.

## Pitfalls

- Package scope is **`@ekz/*`**, not `@erkez/*`
- Do not force `@babel/core` via Yarn resolutions — Babel 7 from `eslint-plugin-react-hooks` as a transitive dep is acceptable
- `eslint-webpack-plugin@6` defaults to flat config — matches `eslint.config.js` consumers

For ESLint config specifics, see [eslint-config-packer](../eslint-config-packer/SKILL.md).
