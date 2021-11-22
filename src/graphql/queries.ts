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
      github {
        id
        name
        url
        owner
        repo
        team
        item
      }
      createdAt
      giver {
        id
        username
        email
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
        github {
          id
          name
          url
          owner
          repo
          team
          item
        }
        createdAt
        giver {
          id
          username
          email
          createdAt
          updatedAt
        }
        receiver {
          id
          username
          email
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
      kudosGiven {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
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
          updatedAt
        }
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
        kudosGiven {
          nextToken
        }
        kudosReceived {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
