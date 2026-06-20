# Packer documentation site

Docusaurus site published at [packer.ekz.io](https://packer.ekz.io/).

## Local development

From the repository root:

```sh
yarn install
yarn docs:dev
```

Build static files:

```sh
yarn docs:build
yarn workspace packer-docs serve
```

Content lives in `docs/content/`. Configuration is in `docusaurus.config.js`.

Deployment runs via `.github/workflows/docs.yml` on push to `master`.

## Custom domain

Published at **https://packer.ekz.io/** via `docs/static/CNAME`. In GitHub **Settings → Pages**, set the custom domain to `packer.ekz.io`. DNS:

```
packer.ekz.io  CNAME  erkez.github.io
```

Enable HTTPS in GitHub Pages after DNS propagates.
