# Wersion

[![MIT License](https://img.shields.io/github/license/ivangabriele/wersion?style=for-the-badge)](https://github.com/ivangabriele/wersion/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/wersion?style=for-the-badge)](https://www.npmjs.com/package/wersion)

Makes bumping your monorepos workspaces version a breeze 🌬️.

**It's mostly useful for those using Yarn Berry (v2/v3)**, but you can use it with npm, pnpm and Yarn Classic (v1).

---

- [Features](#features)
- [Roadmap](#roadmap)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [First Setup](#first-setup)
- [Usage](#usage)
  - [Pre \& Post Scripts](#pre--post-scripts)

---

## Features

- [x] `prewersion` & `postwersion` scripts
- [x] `npm`, `pnpm`, `Yarn Classic (v1)` & `Yarn Berry (v2, v3)` package managers
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
# or
npm i -g wersion # to install it globally
```

## Usage

Simply run:

```sh
yarn wersion <release>
# or
pnpm wersion <release>
# or
npx wersion <release>
# or
wersion <release> # if installed globally
```

`<release>` can be one of: "patch", "minor", "major", "prepatch", "preminor", "premajor" or "prewersion".

You can run it with `--dry-run` or `-d` to see what would happen without actually bumping your packages versions.

### Pre & Post Scripts

In your `package.json`:

```json
{
  "scripts": {
    "prewersion": "echo \"The version will be bumped from v${PREVIOUS_VERSION} to v${NEXT_VERSION}.\"",
    "postwersion": "echo \"The version has been bumped from v${PREVIOUS_VERSION} to v${NEXT_VERSION}.\""
  }
}
```
