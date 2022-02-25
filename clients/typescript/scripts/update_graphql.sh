#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cp -r $SCRIPT_DIR/../../../src/* $SCRIPT_DIR/../src/
