#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$SCRIPT_DIR/..

amplify api gql-compile && amplify codegen

$ROOT_DIR/clients/typescript/scripts/update_graphql.sh
