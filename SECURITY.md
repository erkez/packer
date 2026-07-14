# Security policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |
| 0.16.x  | No        |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

Report privately through either channel:

- [GitHub private vulnerability reporting](https://github.com/erkez/packer/security/advisories/new) — preferred, and keeps the report attached to the repository.
- Email **security@ekz.io**.

Include:

- Package and version affected
- Steps to reproduce
- Impact assessment if known

We aim to acknowledge reports within a few business days and will coordinate a fix and release before public disclosure when appropriate.

## Release integrity

`@ekz/packer` and `@ekz/eslint-config-packer` are published from GitHub Actions using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC). Releases use **`yarn npm publish`** (via `scripts/release.mjs`) so Yarn resolves `workspace:` dependencies before upload; `changeset publish` alone would publish broken `workspace:^` ranges.

Verify provenance on npm when installing.

## Dependency updates

- [Dependabot](https://github.com/erkez/packer/blob/master/.github/dependabot.yml) opens weekly **grouped** update PRs for npm and GitHub Actions (minor/patch, major, and security advisories batched per ecosystem).
- Minor, patch, and security Dependabot PRs are **auto-merged** when CI and dependency review pass (see [dependabot-automerge.yml](https://github.com/erkez/packer/blob/master/.github/workflows/dependabot-automerge.yml)); major updates require manual review.
- Pull requests run [dependency review](https://github.com/erkez/packer/blob/master/.github/workflows/dependency-review.yml) and block merges that introduce **high** or **critical** vulnerabilities.
- Yarn enforces a 7-day [minimum package age](https://yarnpkg.com/configuration/yarnrc#npmMinimalAgeGate) for newly published npm versions (`.yarnrc.yml`).
