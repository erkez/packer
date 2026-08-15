---
'@ekz/packer': minor
---

Add `@ekz/packer/vite` and `@ekz/packer/webpack` subpath exports. The root entry point re-exports both bundlers, so configuring one still loads the other along with all of its loaders and plugins. The subpaths load only the half you configure; the root entry point is unchanged.
