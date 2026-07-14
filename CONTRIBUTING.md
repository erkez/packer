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
| `yarn test` | Rebuild, then run the test suite |
| `yarn lint` | Lint the package and the example apps |
| `yarn audit` | Fail on high-severity advisories in the dependency tree |
| `yarn docs:dev` | Run the documentation site locally |

The `examples/` workspaces consume the local build, so `yarn workspace my-app build:prod` is a useful end-to-end check that a config change actually produces a working bundle.

## Tests

`packages/packer/test/` covers the emitted Webpack and Vite configurations, using Node's built-in test runner — there is no test framework to install.

**Any change to how a configuration is generated needs a test.** New options, changed defaults, and changed merge behaviour are all user-visible, and an assertion on the emitted config is the cheapest way to keep them that way. Bug fixes should come with a test that fails without the fix.

Tests run against the built `dist/`, which is what users consume, so `yarn test` rebuilds first — never run `node --test` directly, or you will be testing the previous build.

Some behaviour is only observable inside a plugin instance rather than on the config object (the `eslint`, `define`, `provide` and `html` options, for example). Assert on the specific fields Packer sets — `findPlugin(config, 'DefinePlugin').definitions` — rather than snapshotting a whole plugin's options, which would churn whenever that plugin's own defaults change.

Snapshots cover overall config shape. Regenerate them deliberately, and read the diff:

```sh
yarn workspace @ekz/packer test --test-update-snapshots
```

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
