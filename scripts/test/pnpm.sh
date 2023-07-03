#!/bin/bash

set -e

yarn build
npm link

cd ./examples/pnpm
wersion patch

cd ../..
git reset --soft HEAD~1
git reset
git --no-pager diff
git checkout .
git tag -d v1.0.1
