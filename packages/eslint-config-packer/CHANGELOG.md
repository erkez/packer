# @ekz/eslint-config-packer

## 1.0.0-beta.0

### Major Changes

- 0d18d78: Breaking release migrating from 0.16:

  - **@ekz/packer**: TypeScript source compiled to `dist/`, Node.js 24+, Babel 8, webpack toolchain updates
  - **ESLint**: flat config only (ESLint 10); remove `.eslintrc`, add `eslint.config.js` via `@ekz/packer/recommended` and `/typescript`
  - **@ekz/eslint-config-packer**: flat config modules replacing legacy JSON configs

  See `packages/packer/README.md` for consumer migration steps.
