---
"@ekz/packer": patch
"@ekz/eslint-config-packer": patch
---

Fix npm publishing for Yarn workspaces: release now uses `yarn npm publish` so `@ekz/eslint-config-packer` is published as a semver range instead of the broken `workspace:^` protocol left by `changeset publish`.
