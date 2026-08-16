---
'@ekz/packer': minor
---

Upgrade to webpack-dev-server v6. Packer's own defaults are unchanged — port 9000, hot reload, compression, and the CORS header — and `npx webpack-dev-server --mode=development` still works, because the v6 binary is the same shim that delegates to `webpack-cli serve`.

Applications that pass a custom `devServer` block may need changes. v6 moves to Express 5 and drops several options: `proxy.bypass` (use `router` or `context`), SockJS (`webSocketServer: 'sockjs'`), and `server.type: 'spdy'` (use `'http2'`). It also requires Node.js 22.15 or later, which Packer's own Node 24 floor already satisfies. See the [v6 release notes](https://github.com/webpack/webpack-dev-server/releases/tag/v6.0.0) for the full list.
