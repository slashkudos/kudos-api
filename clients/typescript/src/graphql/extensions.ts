export const searchKudosTotal = /* GraphQL */ `
  query SearchKudos(
    $filter: SearchableKudoFilterInput
    $sort: [SearchableKudoSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableKudoAggregationInput]
  ) {
    searchKudos(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken, from: $from, aggregates: $aggregates) {
      total
    }
  }
`;

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
