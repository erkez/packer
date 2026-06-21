---
sidebar_position: 5
---

# Scripts

For Webpack applications, add these scripts to your app's `package.json`:

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

## Vite scripts

For Vite applications, use Vite's CLI:

```json
{
    "scripts": {
        "lint": "npx eslint .",
        "lint:fix": "yarn lint --fix",
        "build": "yarn build:prod",
        "build:dev": "npx vite build --mode development",
        "build:prod": "npx vite build",
        "preview": "npx vite preview",
        "start": "npx vite"
    }
}
```

Vite builds do not run ESLint automatically, so keep `lint` as a separate command.

## Commands

| Script | Purpose |
|--------|---------|
| `start` | Dev server with hot reload (port 9000 by Packer default) |
| `build:dev` | Development build |
| `build:prod` | Production build |
| `lint` | Run ESLint across the project |
