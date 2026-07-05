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
yarn workspace @ekz/packer build
yarn workspace @ekz/packer lint
yarn workspace my-app lint   # when webpack or eslint surface changes
```

## Examples

Dual purpose: `workspace:^` in-repo; users copy out and pin `"@ekz/packer": "^x.y.z"`. Details in `examples/typescript/README.md`.

Do not add nested `yarn.lock` or `bin/setup-node` — use `.nvmrc` + `nvm use`.

## Before finishing

After editing source or config, run lint on affected workspaces before marking the task done. Use Node from `.nvmrc` (`nvm use`) — lint fails on older Node versions.

```sh
nvm use
yarn workspace @ekz/packer lint        # packages/packer/src, eslint-config-packer
yarn workspace my-app lint             # examples/typescript when webpack/eslint surface changes
yarn workspace @ekz/packer lint:fix    # auto-fix Prettier and other fixable rules
```

Formatting runs through ESLint (`eslint-plugin-prettier`), not a separate Prettier pass. Fix reported issues or run `lint:fix`; do not leave lint errors for CI.

## CI and release

- **CI** (`.github/workflows/ci.yml`): on PR/push — `yarn build`, `yarn lint`, `yarn docs:build`, `my-app build:prod`
- **Dependency review** (`.github/workflows/dependency-review.yml`): blocks PRs that add high/critical vulnerabilities
- **Dependabot** (`.github/dependabot.yml`): weekly grouped npm + GitHub Actions updates (minor/patch, major, and security each in one PR per ecosystem)
- **Dependabot auto-merge** (`.github/workflows/dependabot-automerge.yml`): rebase-merge minor/patch/security PRs after required checks pass; majors stay manual (default-branch ruleset allows rebase only)
- **Docs** (`.github/workflows/docs.yml`): Docusaurus → GitHub Pages at `https://packer.ekz.io/` (custom domain via `docs/static/CNAME`; DNS `packer.ekz.io` CNAME → `erkez.github.io`, HTTPS in GitHub Pages settings)
- **Scorecard** (`.github/workflows/scorecard.yml`): OSSF Scorecard on push to `master` + weekly schedule, publishes publicly (`publish_results: true`) and uploads SARIF to code scanning; badge in `README.md`. Only scores `master` — a feature branch won't update it.
- **CodeQL** (`.github/workflows/codeql.yml`): SAST on push to `master`, PRs, and a weekly schedule; JS/TS analysis uploaded to code scanning.
- **Release** (`.github/workflows/release.yml`): Changesets on `master` → version PR or npm publish via `yarn npm publish --provenance` (see `scripts/release.mjs`; **not** `changeset publish`, which leaves `workspace:` ranges on npm). Version PR commits use `commitMode: github-api` so they are GitHub-verified under signed-commit rulesets. After a real publish, it also packs both workspaces, generates a build provenance attestation (`actions/attest-build-provenance`), and uploads it as an asset on both GitHub Releases (which `changesets/action` creates automatically from the tags).
- Packages are **fixed** in `.changeset/config.json` — they always share a version
- **License**: MIT, copyright erkez — root `LICENSE` plus a copy in each published package; keep `LICENSE` in each package's `files` array
- Requires **npm trusted publishing** configured on npmjs.com for `@ekz/packer` and `@ekz/eslint-config-packer` (GitHub Actions → repo `erkez/packer`, workflow **`release.yml`** — filename must match exactly)
- No `NPM_TOKEN` — publish uses OIDC (`id-token: write` in release workflow)
- GA'd at 1.0.0 — no longer in Changesets pre-release mode; publishes to `latest`
- All GitHub Actions across workflows are **pinned to commit SHA** with a `# vX` comment (OpenSSF Scorecard Pinned-Dependencies) — Dependabot bumps both the SHA and comment

Contributor flow: `yarn changeset` → PR → merge → release PR merges → npm publish (`latest` tag).

Consumer-facing changelog and migration notes go in `packages/packer/README.md`.

### Merging your own signed commits

Do **not** use the GitHub web "Rebase and merge" button for your own PRs — it replays each commit as a new, unsigned object (GitHub can't sign with your personal key, and won't sign as itself for rebase specifically — a long-standing GitHub limitation), so your verified signatures are lost even though `required_signatures` is on the ruleset. Squash-merge avoids that but collapses the PR into one GitHub-signed commit, losing per-commit history — not worth it given one-commit-per-change/changeset conventions here.

Instead, merge locally and push directly (repo admin bypasses the ruleset's PR requirement):

```sh
git checkout master
git pull --ff-only
git merge --ff-only <branch>
git push
```

A fast-forward creates no new commit objects, so nothing needs re-signing — original signatures ride along intact. This only works if `master` can fast-forward to `<branch>` (i.e. `<branch>` was rebased on latest `master`, not merged); rebase it locally first if not.

## Pitfalls

- Package scope is **`@ekz/*`**, not `@erkez/*`
- Do not force `@babel/core` via Yarn resolutions — Babel 7 from `eslint-plugin-react-hooks` as a transitive dep is acceptable
- `eslint-webpack-plugin@6` defaults to flat config — matches `eslint.config.js` consumers

For ESLint config specifics, see [eslint-config-packer](../eslint-config-packer/SKILL.md).
