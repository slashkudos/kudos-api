/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchKudos = /* GraphQL */ `
  query SearchKudos(
    $filter: SearchableKudoFilterInput
    $sort: [SearchableKudoSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableKudoAggregationInput]
  ) {
    searchKudos(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        giverId
        receiverId
        message
        kudoVerb
        dataSourceApp
        createdAt
        type
        link
        metadata
        giver {
          id
          username
          email
          profileImageUrl
          dataSourceApp
          kudosGiven {
            nextToken
          }
          kudosReceived {
            nextToken
          }
          createdAt
          updatedAt
        }
        receiver {
          id
          username
          email
          profileImageUrl
          dataSourceApp
          kudosGiven {
            nextToken
          }
          kudosReceived {
            nextToken
          }
          createdAt
          updatedAt
        }
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const searchPeople = /* GraphQL */ `
  query SearchPeople(
    $filter: SearchablePersonFilterInput
    $sort: [SearchablePersonSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchablePersonAggregationInput]
  ) {
    searchPeople(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        username
        email
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            kudoVerb
            dataSourceApp
            createdAt
            type
            link
            metadata
            updatedAt
          }
          nextToken
        }
        kudosReceived {
          items {
            id
            giverId
            receiverId
            message
            kudoVerb
            dataSourceApp
            createdAt
            type
            link
            metadata
            updatedAt
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getKudo = /* GraphQL */ `
  query GetKudo($id: ID!) {
    getKudo(id: $id) {
      id
      giverId
      receiverId
      message
      kudoVerb
      dataSourceApp
      createdAt
      type
      link
      metadata
      giver {
        id
        username
        email
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            kudoVerb
            dataSourceApp
            createdAt
            type
            link
            metadata
            updatedAt
          }
          nextToken
        }
        kudosReceived {
          items {
            id
            giverId
            receiverId
            message
            kudoVerb
            dataSourceApp
            createdAt
            type
            link
            metadata
            updatedAt
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      receiver {
        id
        username
        email
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            kudoVerb
            dataSourceApp
            createdAt
            type
            link
            metadata
            updatedAt
          }
          nextToken
        }
        kudosReceived {
          items {
            id
            giverId
            receiverId
            message
            kudoVerb
            dataSourceApp
            createdAt
            type
            link
            metadata
            updatedAt
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const listKudos = /* GraphQL */ `
  query ListKudos(
    $filter: ModelKudoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listKudos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        giverId
        receiverId
        message
        kudoVerb
        dataSourceApp
        createdAt
        type
        link
        metadata
        giver {
          id
          username
          email
          profileImageUrl
          dataSourceApp
          kudosGiven {
            nextToken
          }
          kudosReceived {
            nextToken
          }
          createdAt
          updatedAt
        }
        receiver {
          id
          username
          email
          profileImageUrl
          dataSourceApp
          kudosGiven {
            nextToken
          }
          kudosReceived {
            nextToken
          }
          createdAt
          updatedAt
        }
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPerson = /* GraphQL */ `
  query GetPerson($id: ID!) {
    getPerson(id: $id) {
      id
      username
      email
      profileImageUrl
      dataSourceApp
      kudosGiven {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
          type
          link
          metadata
          giver {
            id
            username
            email
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          receiver {
            id
            username
            email
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          updatedAt
        }
        nextToken
      }
      kudosReceived {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
          type
          link
          metadata
          giver {
            id
            username
            email
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          receiver {
            id
            username
            email
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPeople = /* GraphQL */ `
  query ListPeople(
    $filter: ModelPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPeople(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            kudoVerb
            dataSourceApp
            createdAt
            type
            link
            metadata
            updatedAt
          }
          nextToken
        }
        kudosReceived {
          items {
            id
            giverId
            receiverId
            message
            kudoVerb
            dataSourceApp
            createdAt
            type
            link
            metadata
            updatedAt
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const kudosByDate = /* GraphQL */ `
  query KudosByDate(
    $type: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelKudoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    kudosByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        giverId
        receiverId
        message
        kudoVerb
        dataSourceApp
        createdAt
        type
        link
        metadata
        giver {
          id
          username
          email
          profileImageUrl
          dataSourceApp
          kudosGiven {
            nextToken
          }
          kudosReceived {
            nextToken
          }
          createdAt
          updatedAt
        }
        receiver {
          id
          username
          email
          profileImageUrl
          dataSourceApp
          kudosGiven {
            nextToken
          }
          kudosReceived {
            nextToken
          }
          createdAt
          updatedAt
        }
        updatedAt
      }
      nextToken
    }
  }
`;
