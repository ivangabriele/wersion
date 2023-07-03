# Wersion

[![MIT License](https://img.shields.io/github/license/ivangabriele/wersion?style=for-the-badge)](https://github.com/ivangabriele/wersion/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/wersion?style=for-the-badge)](https://www.npmjs.com/package/wersion)

Makes bumping your monorepos workspaces version a breeze 🌬️.

> This is a work in progress.

---

- [Features](#features)
- [Roadmap](#roadmap)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [First Setup](#first-setup)
- [Usage](#usage)

---

## Features

- [x] Supports `preversion` & `postversion` scripts
- [x] Supports `npm`, `pnpm`, `Yarn Classic (1)` & `Yarn Berry (2 => v2, v3)` package managers

## Roadmap

- [ ] `allowedBranches` configuration key
- [ ] `--dry-run` CLI option

## Installation

### Prerequisites

- npm, pnpm or Yarn v1/v3
- Setting the `workspaces` field in your `package.json` file (i.e. `"workspaces": ["packages/*"]``)

### First Setup

First, install Wersion:

```sh
yarn add -DE wersion
# or
npm i -DE wersion
```

Then, add the following to your `package.json`:

```json
{
  "scripts": {
    // "preversion": ...",
    "version": "wersion"
    // "postversion": ...",
  }
}
```

You're done! 🎉

## Usage

Simply run
