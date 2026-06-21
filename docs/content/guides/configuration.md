---
sidebar_position: 1
---

# Configuration

Packer exposes separate configuration APIs for Webpack and Vite. Use the guide for the bundler your app runs:

- [Webpack configuration](/docs/guides/webpack-configuration) — application and library builds.
- [Vite configuration](/docs/guides/vite-configuration) — application builds.

Both APIs set `@root` → `./src` by default. Mirror that alias in `tsconfig.json` `paths` for TypeScript:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@root/*": ["src/*"]
        }
    }
}
```

See the `@ekz/packer` TypeScript types in `dist/` for the full options surface.
