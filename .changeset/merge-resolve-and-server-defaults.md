---
"@ekz/packer": patch
---

Deep-merge caller-supplied `resolve` and `server`/`devServer` options with Packer's defaults instead of overwriting them. Previously, passing any `resolve.alias` entry dropped the built-in `@root` alias, and passing any `server.headers`/`devServer.headers` entry dropped the default `Access-Control-Allow-Origin: *` header. This affected both the vite and webpack configurations.

Note that defaults can no longer be removed by passing an empty object: `resolve.alias` and header entries are now always merged on top of Packer's defaults.
