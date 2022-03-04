#!/usr/bin/env pwsh

<#
    .SYNOPSIS
    Post devcontainer create script to run.

    .DESCRIPTION
    Installs required dev tools and configurations.
#>

[CmdletBinding()]
Param()

git config --global pull.rebase true
sudo npm install -g @aws-amplify/cli@7.6.22

# Setup AWS default profile
mkdir -p ~/.aws

echo @"
[default]
region=us-east-1
"@ > ~/.aws/config

if($env:AWS_ACCESS_KEY_ID -and $env:AWS_SECRET_ACCESS_KEY) {
    echo @"
[default]
aws_access_key_id = $env:AWS_ACCESS_KEY_ID
aws_secret_access_key = $env:AWS_SECRET_ACCESS_KEY
"@ > ~/.aws/credentials
} else {
    Write-Warning "User's Codespace environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY not set. `nRunning 'aws configure'"
    aws configure
}

aws configure list

Write-Host "amplify version: " -NoNewLine
amplify --version

nvm install lts/gallium
nvm use lts/gallium
