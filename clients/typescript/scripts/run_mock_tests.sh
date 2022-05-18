#!/bin/bash
# Run integration tests against local mock graphql api

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$SCRIPT_DIR/..
runTestsExitCode=0

export API_URL='http://localhost:20002/graphql'
export API_KEY='da2-fakeApiId123456'

cd $ROOT_DIR
echo "Installing dependencies..."
npm ci
cd - 1>/dev/null

echo "Deleting mock data..."
rm -rf ../../amplify/mock-data/

echo "Starting mock api..."
while read line; do
  cd $ROOT_DIR

  if echo $line | grep "AppSync Mock endpoint is running.*"; then
    echo "Executing integration tests..."
    npm run test:int
    runTestsExitCode=$?

    echo "Terminating mock api..."
    lsof -ti tcp:20002 | xargs kill
  fi
  if echo $line | grep "Port 20003 is already in use.*"; then
    echo "Port is already in use. Attempting to run tests..."
    npm run test:int

    echo "Terminating mock api..."
    lsof -ti tcp:20002 | xargs kill
  fi

  cd - 1>/dev/null
done < <(amplify mock api)

echo "Done."

if [ "$runTestsExitCode" -ne "0" ]; then
  echo "Integration tests failed"
  exit 1
fi
