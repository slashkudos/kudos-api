#!/usr/bin/env pwsh

<#
    .SYNOPSIS
    Post devcontainer create script to run.

    .DESCRIPTION
    Installs required dev tools and configurations.
#>

git config --global pull.rebase true
sudo npm install -g @aws-amplify/cli

# Setup AWS default profile
mkdir -p ~/.aws

echo @"
[default]
region=us-east-1
"@ > ~/.aws/config

echo @"
[default]
aws_access_key_id = $env:AWS_ACCESS_KEY_ID
aws_secret_access_key = $env:AWS_SECRET_ACCESS_KEY
"@ > ~/.aws/credentials

Write-Host "amplify version: " -NoNewLine
amplify --version
