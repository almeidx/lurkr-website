![Pepe Website banner](https://i.imgur.com/LHyZGz9.png)

# Table of Contents

- [Overview](#overview)
- [Local setup](#local-setup)
  - [Cloning repository](#cloning-repository)
  - [Running the websites](#running-the-websites)
- [Deployment](#deployment)
- [Author](#author)

---

## Overview

This repository houses the websites for the Pepe Emoji Discord network. Notably, the [pepemanager.com] and [pepe-is.life] websites.

---

### Local setup

This setup assumes you have [Git], and [Node.js] setup on your machine. This repository requires [Node.js] version 16 or higher. This repository uses the [Yarn 3] package manager, so you should have basic knowledge about how to use it. It also uses [yarn workspaces] to manage both websites from the root directory.

#### Cloning repository

- `git clone git@github.com:almeidx/pepe-website.git`
- `cd pepe-website`
- `yarn`

Note: If you don't have yarn installed globally, you'll have to run `npm i -g yarn`.

#### Running the websites

- To start the bot website: `yarn bot dev`
- To start the main website: `yarn main dev`

Note: Most features of the websites require an API instance running, which is currently not publicly available.

---

### Deployment

The deployment of the websites is all automated by [Vercel]

---

### Author

**pepe-website** © [almeidx], released under the [ISC] license.

> GitHub [@almeidx]

[pepemanager.com]: https://pepemanager.com
[pepe-is.life]: https://pepe-is.life
[git]: https://git-scm.com/
[node.js]: https://nodejs.org
[vercel]: https://vercel.com
[yarn 3]: https://yarnpkg.com
[yarn workspaces]: https://yarnpkg.com/features/workspaces
[isc]: https://github.com/almeidx/pepe-website/blob/main/LICENSE
[almeidx]: https://almeidx.dev
[@almeidx]: https://github.com/almeidx
