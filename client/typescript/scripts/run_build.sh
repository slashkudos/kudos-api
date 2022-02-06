#!/bin/bash

# ncc cannot specify which tsconfig.json file to use,
# so we have to rename tsconfig-build.json to tsconfig.json
# https://github.com/vercel/ncc/issues/457

mv tsconfig.json tsconfig-dev.json
mv tsconfig-build.json tsconfig.json

rm -rf src/dist
ncc build src/index.ts
ncc run dist/index.js

mv tsconfig.json tsconfig-build.json
mv tsconfig-dev.json tsconfig.json
