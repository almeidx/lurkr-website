<img src="./dash/src/assets/banner.webp" alt="Lurkr bot banner" height="200" />

# Table of Contents

- [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Local setup](#local-setup)
      - [Cloning repository](#cloning-repository)
      - [Running the website](#running-the-website)
    - [Deployment](#deployment)
    - [Author](#author)

---

## Overview

This repository houses the [lurkr.gg] website, which is the website for the Lurkr Discord bot.

---

### Local setup

This setup assumes you have [Git], and [Node.js] setup on your machine.
This repository requires [Node.js] version 24.15 or higher (see `.node-version`), and uses the [pnpm] package manager,
so you should have basic knowledge about how to use them.

#### Cloning repository

- `git clone git@github.com:almeidx/lurkr-website.git`
- `cd lurkr-website`
- `corepack install`
- `pnpm install --frozen-lockfile`
- `cp dash/.env.local.example dash/.env.local`
- `cp docs/.env.local.example docs/.env.local`

Note: If you don't have corepack enabled, you can do it with `corepack enable`.

#### Running the website

The dashboard and docs site run separately:

- `cd dash && pnpm dev` — dashboard
- `cd docs && pnpm dev` — documentation site

Note: Features that require signing-in will not work as the login will not be functional without a local API instance
running, which is currently not publicly available.

---

### Deployment

The dashboard (`dash/`) is deployed on [Vercel], while the documentation site (`docs/`) is deployed on [Cloudflare Workers]. Both deployments are automated.

---

### Author

**lurkr-website** © [almeidx], released under the [GNU AGPLv3] license.

> GitHub [@almeidx]

[lurkr.gg]: https://lurkr.gg
[git]: https://git-scm.com/
[node.js]: https://nodejs.org
[vercel]: https://vercel.com
[cloudflare workers]: https://workers.cloudflare.com/
[pnpm]: https://pnpm.io/
[gnu agplv3]: https://github.com/almeidx/lurkr-website/blob/main/LICENSE
[almeidx]: https://almeidx.dev
[@almeidx]: https://github.com/almeidx
