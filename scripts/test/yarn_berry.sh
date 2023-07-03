#!/bin/bash

set -e

yarn build
npm link
cd ./examples/yarn-berry
yarn version patch
git add .
git --no-pager diff
git reset
git checkout .
