# Wersion

[![MIT License](https://img.shields.io/github/license/ivangabriele/wersion?style=for-the-badge)](https://github.com/ivangabriele/wersion/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/wersion?style=for-the-badge)](https://www.npmjs.com/package/wersion)

Makes bumping your monorepos workspaces version a breeze 🌬️.

**It's mostly useful for those using Yarn**, but you can use it with npm & pnpm.

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

- [x] `preversion` & `postversion` scripts
- [x] `npm`, `pnpm`, `Yarn Classic (1)` & `Yarn Berry (2 => v2, v3)` package managers
- [x] `--dry-run` CLI option

## Roadmap

- [ ] `allowedBranches` configuration key
- [ ] Specified version support (i.e. `wersion 1.2.3`)

## Installation

### Prerequisites

- npm, pnpm or Yarn v1/v3
- Setting the `workspaces` field in your `package.json` file (i.e. `"workspaces": ["packages/*"]``)

### First Setup

First, install Wersion:

```sh
yarn add -DE wersion
# or
pnpm i -DE wersion
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

Simply run:

```
yarn version <release>
# or
pnpm version <release>
# or
npm run version <release>
```

`<release>` can be one of: "patch", "minor", "major", "prepatch", "preminor", "premajor" or "prerelease".

You can run it with `--dry-run` or `-d` to see what would happen without actually bumping your packages versions.
