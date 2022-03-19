#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

amplify_env=$1
amplify_appId=$2

if [ -z "$amplify_env" ]; then
    echo "You must provide amplify_env input parameter in order to deploy"
    exit 1
fi

if [ -z "$amplify_appId" ]; then
    echo "You must provide amplify_appId input parameter in order to deploy"
    exit 1
fi

if [ -z "$(amplify env get --name $amplify_env | grep 'No environment found')" ]; then
    echo "Pulling $amplify_env ($amplify_appId)"
    rm -rf amplify-temp
    cp -r amplify amplify-temp

    amplify pull --appId $amplify_appId --envName $amplify_env --yes

    rm -rf amplify/backend/api/*
    rm -rf amplify/backend/auth/*
    rm -rf amplify/backend/function/*
    rm -rf amplify/backend/types/*

    cp -r amplify-temp/* amplify
    rm -rf amplify-temp

    # GraphQL transformer version 2 outputs GraphQL API Key even with "CreateAPIKey": 0
    amplify status | grep -v "GraphQL API KEY"

    status=$?
    exit $status
else
    echo "$amplify_env environment does not exist"
    exit 1
fi
