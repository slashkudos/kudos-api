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
