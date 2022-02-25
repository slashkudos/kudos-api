/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        link
        metadata
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
        nextToken
      }
      kudosReceived {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPersons = /* GraphQL */ `
  query ListPersons(
    $filter: ModelPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPersons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        profileImageUrl
        dataSourceApp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
