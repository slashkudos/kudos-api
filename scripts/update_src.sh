#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

amplify api gql-compile && amplify codegen
