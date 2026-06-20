# Security policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |
| 0.16.x  | No        |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

Email security concerns to the maintainers of `@ekz/packer` (see npm maintainer contacts or your internal security channel). Include:

- Package and version affected
- Steps to reproduce
- Impact assessment if known

We aim to acknowledge reports within a few business days and will coordinate a fix and release before public disclosure when appropriate.

## Release integrity

`@ekz/packer` and `@ekz/eslint-config-packer` are published from GitHub Actions using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC). Releases require a merged Changesets version PR on `master`.

Verify provenance on npm when installing.

## Dependency updates

- [Dependabot](https://github.com/erkez/packer/blob/master/.github/dependabot.yml) opens weekly update PRs for npm and GitHub Actions.
- Pull requests run [dependency review](https://github.com/erkez/packer/blob/master/.github/workflows/dependency-review.yml) and block merges that introduce **high** or **critical** vulnerabilities.
- Yarn enforces a 7-day [minimum package age](https://yarnpkg.com/configuration/yarnrc#npmMinimalAgeGate) for newly published npm versions (`.yarnrc.yml`).
