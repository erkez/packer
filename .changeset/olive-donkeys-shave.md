---
'@ekz/packer': patch
---

Honour falsy `output` values instead of replacing them with the defaults. Each `output` field was defaulted with `||`, which could not tell "not supplied" from "supplied as a falsy value", so `output.publicPath: ''` — webpack's way of asking for relative asset URLs — was silently rewritten to `'/'`. `output` is now merged with its defaults once, like `assetPaths` already was.
