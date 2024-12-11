<img src="./src/assets/banner.png" alt="Lurkr bot banner" height="200" />

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

This setup assumes you have [Git], and [Node.js] setup on your machine. This repository requires [Node.js] version 22 or higher, and uses the [pnpm] package manager, so you should have basic knowledge about how to use them.

#### Cloning repository

- `git clone git@github.com:almeidx/lurkr-website.git`
- `cd lurkr-website`
- `corepack install`
- `pnpm install`

Note: If you don't have corepack enabled, you can do it with `corepack enable`.

#### Running the website

- `pnpm dev`

Note: Most features of the website requires an API instance running, which is currently not publicly available.

---

### Deployment

The deployment of the website is all automated by [Vercel]

---

### Author

**lurkr-website** © [almeidx], released under the [GNU AGPLv3] license.

> GitHub [@almeidx]

[lurkr.gg]: https://lurkr.gg
[git]: https://git-scm.com/
[node.js]: https://nodejs.org
[vercel]: https://vercel.com
[pnpm]: https://pnpm.io/
[gnu agplv3]: https://github.com/almeidx/lurkr-website/blob/main/LICENSE
[almeidx]: https://almeidx.dev
[@almeidx]: https://github.com/almeidx
