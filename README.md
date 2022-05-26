# slashkudos API

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
