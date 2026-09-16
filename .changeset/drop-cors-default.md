---
'@ekz/packer': minor
---

Stop sending `Access-Control-Allow-Origin: *` from the Vite and webpack dev servers. Both servers already allow `localhost` origins by default, and the wildcard switched off the cross-origin protections each of them ships — Vite's origin allowlist and webpack-dev-server's `Cross-Origin-Resource-Policy: same-origin` — so any site open in the browser could read source from a running dev server. Apps that load the dev server from a non-localhost origin now have to set `server.headers` (Vite) or `devServer.headers` (webpack) themselves.
