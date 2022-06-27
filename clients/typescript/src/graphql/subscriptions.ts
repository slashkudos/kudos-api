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
      messageLower
      kudoVerb
      dataSourceApp
      createdAt
      type
      link
      metadata
      giver {
        id
        username
        usernameLower
        email
        profileUrl
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            messageLower
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
            messageLower
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
        usernameLower
        email
        profileUrl
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            messageLower
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
            messageLower
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
export const onUpdateKudo = /* GraphQL */ `
  subscription OnUpdateKudo {
    onUpdateKudo {
      id
      giverId
      receiverId
      message
      messageLower
      kudoVerb
      dataSourceApp
      createdAt
      type
      link
      metadata
      giver {
        id
        username
        usernameLower
        email
        profileUrl
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            messageLower
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
            messageLower
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
        usernameLower
        email
        profileUrl
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            messageLower
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
            messageLower
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
export const onDeleteKudo = /* GraphQL */ `
  subscription OnDeleteKudo {
    onDeleteKudo {
      id
      giverId
      receiverId
      message
      messageLower
      kudoVerb
      dataSourceApp
      createdAt
      type
      link
      metadata
      giver {
        id
        username
        usernameLower
        email
        profileUrl
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            messageLower
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
            messageLower
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
        usernameLower
        email
        profileUrl
        profileImageUrl
        dataSourceApp
        kudosGiven {
          items {
            id
            giverId
            receiverId
            message
            messageLower
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
            messageLower
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
export const onCreatePerson = /* GraphQL */ `
  subscription OnCreatePerson {
    onCreatePerson {
      id
      username
      usernameLower
      email
      profileUrl
      profileImageUrl
      dataSourceApp
      kudosGiven {
        items {
          id
          giverId
          receiverId
          message
          messageLower
          kudoVerb
          dataSourceApp
          createdAt
          type
          link
          metadata
          giver {
            id
            username
            usernameLower
            email
            profileUrl
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          receiver {
            id
            username
            usernameLower
            email
            profileUrl
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
          messageLower
          kudoVerb
          dataSourceApp
          createdAt
          type
          link
          metadata
          giver {
            id
            username
            usernameLower
            email
            profileUrl
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          receiver {
            id
            username
            usernameLower
            email
            profileUrl
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
export const onUpdatePerson = /* GraphQL */ `
  subscription OnUpdatePerson {
    onUpdatePerson {
      id
      username
      usernameLower
      email
      profileUrl
      profileImageUrl
      dataSourceApp
      kudosGiven {
        items {
          id
          giverId
          receiverId
          message
          messageLower
          kudoVerb
          dataSourceApp
          createdAt
          type
          link
          metadata
          giver {
            id
            username
            usernameLower
            email
            profileUrl
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          receiver {
            id
            username
            usernameLower
            email
            profileUrl
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
          messageLower
          kudoVerb
          dataSourceApp
          createdAt
          type
          link
          metadata
          giver {
            id
            username
            usernameLower
            email
            profileUrl
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          receiver {
            id
            username
            usernameLower
            email
            profileUrl
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
export const onDeletePerson = /* GraphQL */ `
  subscription OnDeletePerson {
    onDeletePerson {
      id
      username
      usernameLower
      email
      profileUrl
      profileImageUrl
      dataSourceApp
      kudosGiven {
        items {
          id
          giverId
          receiverId
          message
          messageLower
          kudoVerb
          dataSourceApp
          createdAt
          type
          link
          metadata
          giver {
            id
            username
            usernameLower
            email
            profileUrl
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          receiver {
            id
            username
            usernameLower
            email
            profileUrl
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
          messageLower
          kudoVerb
          dataSourceApp
          createdAt
          type
          link
          metadata
          giver {
            id
            username
            usernameLower
            email
            profileUrl
            profileImageUrl
            dataSourceApp
            createdAt
            updatedAt
          }
          receiver {
            id
            username
            usernameLower
            email
            profileUrl
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
