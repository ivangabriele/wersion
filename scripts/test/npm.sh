#!/bin/bash

set -e

yarn build
npm link

cd ./examples/npm
wersion patch

cd ../..
git reset --soft HEAD~1
git reset
git --no-pager diff
git checkout .
git tag -d v99.88.78
