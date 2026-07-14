# Contributing

Thanks for your interest in improving Packer.

## Reporting bugs

Open an issue at [github.com/erkez/packer/issues](https://github.com/erkez/packer/issues). Include the Packer version, the bundler you are configuring (Webpack or Vite), and a minimal reproduction if you can.

**Do not report security vulnerabilities as public issues** — follow [SECURITY.md](SECURITY.md) instead.

## Development setup

The repository is a Yarn workspaces monorepo. Node is pinned in [.nvmrc](.nvmrc) and Yarn is managed by Corepack:

```sh
corepack enable
yarn install --immutable
```

Common tasks:

| Command | Purpose |
| --- | --- |
| `yarn build` | Build `@ekz/packer` |
| `yarn lint` | Lint the package and the example apps |
| `yarn audit` | Fail on high-severity advisories in the dependency tree |
| `yarn docs:dev` | Run the documentation site locally |

The `examples/` workspaces consume the local build, so `yarn workspace my-app build:prod` is a useful end-to-end check that a config change actually produces a working bundle.

## Submitting changes

1. Branch off `master`.
2. Make your change, and add a changeset describing it:

   ```sh
   yarn changeset
   ```

   Any change to `@ekz/packer` or `@ekz/eslint-config-packer` that users would notice needs one — it drives the version bump and the changelog. Internal-only changes (CI, docs, tests) do not.

3. Open a pull request.

### What we look for

- **CI must pass.** The workflow runs the build, lint, the dependency audit, the documentation build, and a production build of each example app. Pull requests are also gated by CodeQL and dependency review.
- **Keep the public API deliberate.** Packer is an opinionated config generator, and every option added is one that has to be supported. Prefer changing defaults over adding a flag.
- **Match the surrounding code.** No enforced style beyond what ESLint and Prettier already check.

Dependency updates are handled automatically by Dependabot, so please do not open PRs that only bump dependencies.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
