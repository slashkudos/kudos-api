/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateKudo = /* GraphQL */ `
  subscription OnCreateKudo {
    onCreateKudo {
      id
      giverId
      receiverId
      message
      kudoVerb
      dataSource {
        ... on GitHubMetadata {
          name
          url
          owner
          repo
          team
          item
        }
        ... on SlackMetadata {
          name
          url
        }
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
export const onUpdateKudo = /* GraphQL */ `
  subscription OnUpdateKudo {
    onUpdateKudo {
      id
      giverId
      receiverId
      message
      kudoVerb
      dataSource {
        ... on GitHubMetadata {
          name
          url
          owner
          repo
          team
          item
        }
        ... on SlackMetadata {
          name
          url
        }
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
export const onDeleteKudo = /* GraphQL */ `
  subscription OnDeleteKudo {
    onDeleteKudo {
      id
      giverId
      receiverId
      message
      kudoVerb
      dataSource {
        ... on GitHubMetadata {
          name
          url
          owner
          repo
          team
          item
        }
        ... on SlackMetadata {
          name
          url
        }
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
export const onCreatePerson = /* GraphQL */ `
  subscription OnCreatePerson {
    onCreatePerson {
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
export const onUpdatePerson = /* GraphQL */ `
  subscription OnUpdatePerson {
    onUpdatePerson {
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
export const onDeletePerson = /* GraphQL */ `
  subscription OnDeletePerson {
    onDeletePerson {
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
