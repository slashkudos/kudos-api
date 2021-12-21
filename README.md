# Slash Kudos API

The Kudos API.

- [Amplify Admin UI]
- [AppSync GraphQL API]
- [Amplify CLI Commands]
- GraphQL Endpoint (Prod): <https://graphqlapi.slashkudos.com/graphql>
- GraphQL Endpoint (Dev): <https://graphqlapi-dev.slashkudos.com/graphql>

## Stack

- AWS Amplify for the back-end infrastructure
- AWS AppSync GraphQL APIs for the core Kudos CRUD API
- DynamoDB for storage because it's cheap and easy
- REST APIs as needed for integrations such as handling GitHub webhooks

## Project Setup

1. Create the follow Codespace secrets for your user
   1. `AWS_ACCESS_KEY_ID` - Get from AWS Console profile
   2. `AWS_SECRET_ACCESS_KEY` - Get from AWS Console profile
   3. `SLASHKUDOS_PAT` - Create a PAT with scopes `repo`, `read:org`, `admin:public_key` and `codespace`, store it in this secret
2. Create a Codespace and you should be good to go 🚀

## Commands

- `amplify init`
- `amplify push`
- `amplify api gql-compile`
  - Try seeing error messages here if `amplify push` fails with a generic message

## Other Stuff

- Adding a Lambda function for a DyanmoDB table created for GraphQL: [DyanmoDB Lambda Triggers]

<!-- Links -->
[Amplify Admin UI]: https://us-east-1.admin.amplifyapp.com/admin/d5u222qsuh3lu/dev/graphql
[AppSync GraphQL API]: https://us-east-1.console.aws.amazon.com/appsync/home?region=us-east-1#/bu7sog55jfdeboiekpcjbz5caa/v1/queries
[Amplify CLI Commands]: https://github.com/aws-amplify/amplify-cli#commands-summary
[DyanmoDB Lambda Triggers]: https://docs.amplify.aws/cli/usage/lambda-triggers/#as-a-part-of-the-graphql-api-types-with-model-annotation
