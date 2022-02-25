#!/bin/bash

# ncc cannot specify which tsconfig.json file to use,
# so we have to rename tsconfig-build.json to tsconfig.json
# https://github.com/vercel/ncc/issues/457

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

mv $SCRIPT_DIR/../tsconfig.json $SCRIPT_DIR/../tsconfig-dev.json
mv $SCRIPT_DIR/../tsconfig-build.json $SCRIPT_DIR/../tsconfig.json

rm -rf $SCRIPT_DIR/../src/dist
ncc build $SCRIPT_DIR/../src/index.ts
ncc run $SCRIPT_DIR/../dist/index.js

mv $SCRIPT_DIR/../tsconfig.json $SCRIPT_DIR/../tsconfig-build.json
mv $SCRIPT_DIR/../tsconfig-dev.json $SCRIPT_DIR/../tsconfig.json
