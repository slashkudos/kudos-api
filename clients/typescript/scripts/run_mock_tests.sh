#!/bin/bash
# Run integration tests against local mock graphql api

# Exit immediately if a command exits with a non-zero status.
set -e

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$SCRIPT_DIR/..

export API_URL='http://localhost:20002/graphql'
export API_KEY='da2-fakeApiId123456'

echo "Starting mock api..."
while IFS= read -r line; do
  echo "$line"
  if [[ "$line" == *"AppSync Mock endpoint is running at "* ]]; then
    cd $ROOT_DIR

    echo "Installing dependencies..."
    npm install

    echo "Executing integration tests..."
    npm run test:int

    cd - 1>/dev/null

    echo "Terminating mock api..."
    lsof -ti tcp:20002 | xargs kill
  fi
done < <(amplify mock api)
