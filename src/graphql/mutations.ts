/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createKudo = /* GraphQL */ `
  mutation CreateKudo(
    $input: CreateKudoInput!
    $condition: ModelKudoConditionInput
  ) {
    createKudo(input: $input, condition: $condition) {
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
export const updateKudo = /* GraphQL */ `
  mutation UpdateKudo(
    $input: UpdateKudoInput!
    $condition: ModelKudoConditionInput
  ) {
    updateKudo(input: $input, condition: $condition) {
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
export const deleteKudo = /* GraphQL */ `
  mutation DeleteKudo(
    $input: DeleteKudoInput!
    $condition: ModelKudoConditionInput
  ) {
    deleteKudo(input: $input, condition: $condition) {
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
export const createPerson = /* GraphQL */ `
  mutation CreatePerson(
    $input: CreatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    createPerson(input: $input, condition: $condition) {
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
export const updatePerson = /* GraphQL */ `
  mutation UpdatePerson(
    $input: UpdatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    updatePerson(input: $input, condition: $condition) {
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
export const deletePerson = /* GraphQL */ `
  mutation DeletePerson(
    $input: DeletePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    deletePerson(input: $input, condition: $condition) {
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
