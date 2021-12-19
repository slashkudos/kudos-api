# Slash Kudos API

The Kudos API.

## Quick Reference Guide

- AWS Amplify for the back-end infrastructure
- AWS AppSync GraphQL APIs for the core Kudos CRUD API
- DynamoDB for storage because it's cheap and easy
- REST APIs as needed for integrations such as handling GitHub webhooks

## Project Setup

1. Create the follow Codespace secrets for your user
   1. `AWS_ACCESS_KEY_ID` - Get from AWS Console profile
   2. `AWS_SECRET_ACCESS_KEY` - Get from AWS Console profile
   3. `SLASHKUDOS_PAT` - Create a PAT with scopes `repo`, `admin:public_key` and `codespace`, store it in this secret
2. Create a Codespace and you should be good to go 🚀
