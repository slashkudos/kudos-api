#!/bin/pwsh

# Post devcontainer create script to run

git config --global pull.rebase true
sudo npm install -g @aws-amplify/cli

echo @"
[default]
aws_access_key_id = $env:AWS_ACCESS_KEY_ID
aws_secret_access_key = $env:AWS_SECRET_ACCESS_KEY
"@ >> ~/.aws/credentials
