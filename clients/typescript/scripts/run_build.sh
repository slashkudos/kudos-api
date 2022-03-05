#!/bin/bash

# ncc cannot specify which tsconfig.json file to use,
# so we have to rename tsconfig-build.json to tsconfig.json
# https://github.com/vercel/ncc/issues/457

# Exit immediately if a command exits with a non-zero status.
set -e

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$SCRIPT_DIR/..

mv $ROOT_DIR/tsconfig.json $ROOT_DIR/tsconfig-dev.json
mv $ROOT_DIR/tsconfig-build.json $ROOT_DIR/tsconfig.json

rm -rf $ROOT_DIR/src/dist
ncc build $ROOT_DIR/src/index.ts
ncc run $ROOT_DIR/dist/index.js

mv $ROOT_DIR/tsconfig.json $ROOT_DIR/tsconfig-build.json
mv $ROOT_DIR/tsconfig-dev.json $ROOT_DIR/tsconfig.json
