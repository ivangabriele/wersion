#!/bin/bash

set -e

yarn build
npm link
cd ./examples/yarn-berry
yarn version patch
git reset --soft HEAD~1
git --no-pager diff
git reset
git checkout .
git tag -d v1.0.1
