// Custom graphql queries used to optimize the response size

export const kudosByDateTotal = /* GraphQL */ `
  query KudosByDateTotal($type: String!, $sortDirection: ModelSortDirection, $filter: ModelKudoFilterInput, $limit: Int, $nextToken: String) {
    kudosByDate(type: $type, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
      }
      nextToken
    }
  }
`;

export const listPeopleIds = /* GraphQL */ `
  query ListPeopleIds($filter: ModelPersonFilterInput, $limit: Int, $nextToken: String) {
    listPeople(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
      }
      nextToken
    }
  }
`;
