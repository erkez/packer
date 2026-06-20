# Scripts

Add these scripts to your app's `package.json`:

```json
{
    "scripts": {
        "lint": "npx eslint .",
        "lint:fix": "yarn lint --fix",
        "build": "yarn build:dev",
        "build:dev": "npx webpack --mode=development",
        "build:prod": "npx webpack --mode=production",
        "build:watch": "npx webpack-dev-server --mode=development",
        "start": "yarn build:watch"
    }
}
```

Use `npx webpack` and `npx webpack-dev-server` so CLI binaries resolve from hoisted dependencies when `@ekz/packer` is the only direct dev dependency.

## Commands

| Script | Purpose |
|--------|---------|
| `start` | Dev server with hot reload (port 9000) |
| `build:dev` | Development webpack build |
| `build:prod` | Production build (minify, content hashes, ESLint errors fail the build) |
| `lint` | Run ESLint across the project |
