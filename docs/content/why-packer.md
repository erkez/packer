---
sidebar_position: 1.5
---

# Why Packer

Packer is not a framework. It doesn't own routing, data fetching, or rendering. It's a config layer over Webpack and Vite that gives a React app (or library) sane defaults on day one, while staying out of the way when you need something it doesn't cover.

## vs. hand-rolled Webpack or Vite config

Starting from a blank `webpack.config.js` or `vite.config.js` means wiring up TypeScript, ESLint, a dev server, and asset output yourself. Packer wires these in by default:

- **TypeScript typechecking**, automatically, when a `tsconfig.json` is found — `ts-loader` + ForkTsChecker for Webpack, `vite-plugin-checker` for Vite. Type errors fail the build; the dev server stays non-blocking.
- **ESLint flat config** out of the box, including a TypeScript-aware config.
- **Dev server defaults**: port `9000`, hot reload and compression (Webpack), CORS headers, proxy support.
- **Content-hashed production filenames** and configurable asset path prefixes for JS/CSS/static output.
- **Webpack optimization defaults** (`splitChunks`, Terser) and, for Vite, `@vitejs/plugin-react` enabled automatically.
- **Library builds** — `Packer.webpack.createLibraryConfiguration` produces UMD output for publishing a package, not just an app bundle.

None of this is a black box: native options (`plugins`, `loaders`, `define`, `build`, `devServer`, `resolve`, ...) pass straight through and merge with Packer's defaults, so you're never stuck working around the abstraction.

## vs. Create React App

CRA was [officially deprecated in February 2025](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) and has no active maintainers — it still runs, but only in maintenance mode. Packer aims at the same "install it and start building" ergonomics CRA used to offer, but it's actively maintained and lets you pick Webpack or Vite as the underlying bundler.

## vs. Next.js, Remix, and other meta-frameworks

Packer isn't a competitor to these — they bundle routing, SSR/RSC, and deployment opinions that Packer deliberately doesn't touch. Reach for Packer when you're building a plain SPA or a library and want a build tool that stays out of the way, not a framework that decides how your app is structured.

## Get started

See [Installation](/docs/getting-started/installation) to add Packer to a Webpack or Vite project.
