import { GraphQLClient } from "graphql-request";
import * as winston from "winston";
import {
  CreateKudoInput,
  CreateKudoMutation,
  CreateKudoMutationVariables,
  CreatePersonInput,
  CreatePersonMutation,
  CreatePersonMutationVariables,
  DataSourceApp,
  Kudo,
  KudosByDateQuery,
  KudosByDateQueryVariables,
  KudoVerb,
  ListKudosQuery,
  ListKudosQueryVariables,
  ListPeopleQuery,
  ListPeopleQueryVariables,
  ModelKudoConnection,
  ModelPersonConnection,
  ModelSortDirection,
  Person,
  SearchableKudoConnection,
  SearchableKudoFilterInput,
  SearchablePersonFilterInput,
  SearchKudosQuery,
  SearchKudosQueryVariables,
  SearchPeopleQuery,
  SearchPeopleQueryVariables,
} from "./API";
import { kudosByDateTotal } from "./graphql/extensions";
import { createKudo, createPerson } from "./graphql/mutations";
import { kudosByDate, listKudos, listPeople, searchKudos, searchPeople } from "./graphql/queries";
import { LoggerService } from "./LoggerService";

export interface KudosGraphQLConfig {
  ApiKey: string;
  ApiUrl: string;
}

export interface createKudoOptions {
  dataSource: DataSourceApp;
  giverUsername: string;
  receiverUsername: string;
  message: string;
  tweetId?: string;
  giverProfileImageUrl?: string;
  receiverProfileImageUrl?: string;
}

export class KudosApiClient {
  private readonly graphQLClient: GraphQLClient;
  private readonly logger: winston.Logger;

  constructor(kudosGraphQLConfig: KudosGraphQLConfig) {
    this.logger = LoggerService.createLogger();
    this.graphQLClient = new GraphQLClient(kudosGraphQLConfig.ApiUrl, {
      headers: {
        "x-api-key": kudosGraphQLConfig.ApiKey,
      },
    });
  }

  static async build(kudosGraphQLConfig: KudosGraphQLConfig): Promise<KudosApiClient> {
    return new KudosApiClient(kudosGraphQLConfig);
  }

  public async createKudo(options: createKudoOptions): Promise<{ kudo: Kudo; receiver: Person }> {
    this.logger.info(`Creating Kudo from ${options.giverUsername} to ${options.receiverUsername} with message "${options.message}"`);
    let giver: Person | null = await this.getUser(options.giverUsername, options.dataSource);
    if (!giver) {
      giver = await this.createPerson({
        input: {
          username: options.giverUsername,
          dataSourceApp: options.dataSource,
          profileImageUrl: options.giverProfileImageUrl,
        },
      });
    }
    let receiver: Person | null = await this.getUser(options.receiverUsername, options.dataSource);
    if (!receiver) {
      receiver = await this.createPerson({
        input: {
          username: options.receiverUsername,
          dataSourceApp: options.dataSource,
          profileImageUrl: options.receiverProfileImageUrl,
        },
      });
    }

    const link = this.getLink(options);
    const kudo = await this.sendCreateKudoRequest({
      input: {
        giverId: giver.id,
        receiverId: receiver.id,
        message: options.message,
        link: link,
        dataSourceApp: options.dataSource,
        kudoVerb: KudoVerb.kudos,
      },
    });

    if (!kudo.receiver) {
      throw new Error("Expected a receiver on the kudo");
    }
    if (!kudo.receiver?.kudosReceived?.items) {
      throw new Error("Expected receiver kudosReceived to be returned from sendCreateKudoRequest");
    }

    return { kudo, receiver: kudo.receiver };
  }

  private getLink(options: createKudoOptions): string {
    switch (options.dataSource) {
      case DataSourceApp.twitter:
        return `https://twitter.com/${options.giverUsername}/status/${options.tweetId}`;
      default:
        throw new Error(`Unsupported dataSource ${options.dataSource}`);
    }
  }

  public async listPeople(queryVariables: ListPeopleQueryVariables): Promise<ModelPersonConnection> {
    const listPeopleResponse = await this.graphQLClient.request<ListPeopleQuery, ListPeopleQueryVariables>(listPeople, queryVariables);
    this.logger.http(JSON.stringify(listPeopleResponse));
    const modelPersonConnection = listPeopleResponse.listPeople as ModelPersonConnection;
    return modelPersonConnection;
  }

  public async listKudos(queryVariables?: ListKudosQueryVariables): Promise<ModelKudoConnection> {
    const listKudosResponse = await this.graphQLClient.request<ListKudosQuery, ListKudosQueryVariables>(listKudos, queryVariables);
    this.logger.http(JSON.stringify(listKudosResponse));
    const modelKudoConnection = listKudosResponse.listKudos as ModelKudoConnection;
    return modelKudoConnection;
  }

  public async listKudosByDate(
    queryVariables: KudosByDateQueryVariables = { type: "Kudo", sortDirection: ModelSortDirection.DESC }
  ): Promise<ModelKudoConnection> {
    queryVariables.type = "Kudo";
    const listKudosResponse = await this.graphQLClient.request<KudosByDateQuery, KudosByDateQueryVariables>(kudosByDate, queryVariables);
    this.logger.http(JSON.stringify(listKudosResponse));
    const modelKudoConnection = listKudosResponse.kudosByDate as ModelKudoConnection;
    return modelKudoConnection;
  }

  public async getTotalKudosForReceiver(username: string, dataSource: DataSourceApp): Promise<number | null | undefined> {
    const receiver = await this.getUser(username, dataSource);
    if (!receiver) {
      return null;
    }

    let total = 0;
    const queryVariables: KudosByDateQueryVariables = {
      type: "Kudo",
      sortDirection: ModelSortDirection.DESC,
      filter: {
        receiverId: { eq: receiver.id },
        dataSourceApp: { eq: dataSource },
      },
      limit: 1000,
    };

    let nextToken: string | null | undefined;

    do {
      const result = await this.graphQLClient.request<KudosByDateQuery, KudosByDateQueryVariables>(kudosByDateTotal, queryVariables);
      this.logger.http(JSON.stringify(result));
      if (!result.kudosByDate) {
        throw new Error("Expected kudosByDate to be returned from kudosByDateTotal");
      }
      total += result.kudosByDate.items.length;
      nextToken = result.kudosByDate.nextToken;
      queryVariables.nextToken = nextToken;
    } while (nextToken);

    this.logger.info(`Total kudos for ${username}: ${total}"`);

    return total;
  }

  public async searchKudosByUser(usernameSearchTerm: string): Promise<SearchableKudoConnection> {
    const users = await this.searchUsers(usernameSearchTerm);
    if (users.length === 0) {
      const result: SearchableKudoConnection = {
        __typename: "SearchableKudoConnection",
        total: 0,
        items: [],
        aggregateItems: [],
      };
      return result;
    }
    const userIdFilters: SearchableKudoFilterInput[] = [];
    users.forEach((user) => {
      userIdFilters.push({ receiverId: { eq: user.id } }, { giverId: { eq: user.id } });
    });
    const queryVariables: SearchKudosQueryVariables = {
      filter: { or: userIdFilters },
    };
    const result = await this.graphQLClient.request<SearchKudosQuery, SearchKudosQueryVariables>(searchKudos, queryVariables);
    this.logger.http(JSON.stringify(result));
    const connection = result.searchKudos as SearchableKudoConnection;
    return connection;
  }

  public async searchUsers(usernameSearchTerm: string, dataSourceApp?: DataSourceApp): Promise<Person[]> {
    this.logger.info(`Searching users with username ${usernameSearchTerm}`);

    const filter: SearchablePersonFilterInput = {
      username: { wildcard: `*${usernameSearchTerm}*` },
    };
    if (dataSourceApp) {
      filter.dataSourceApp = { eq: dataSourceApp };
    }

    const peopleResponse = await this.graphQLClient.request<SearchPeopleQuery, SearchPeopleQueryVariables>(searchPeople, {
      filter: filter,
    });
    this.logger.http(JSON.stringify(peopleResponse));

    const people = peopleResponse.searchPeople?.items as Person[];
    this.logger.info(`Found ${people.length} users`);

    return people;
  }

  private async sendCreateKudoRequest(mutationVariables: CreateKudoMutationVariables): Promise<Kudo> {
    this.logger.info(`Sending create kudo request`);
    const input: CreateKudoInput = {
      ...mutationVariables.input,
      kudoVerb: KudoVerb.kudos,
    };
    const createKudoResponse = await this.graphQLClient.request<CreateKudoMutation, CreateKudoMutationVariables>(createKudo, {
      ...mutationVariables,
      input,
    });
    this.logger.http(JSON.stringify(createKudoResponse));
    const kudo = createKudoResponse.createKudo as Kudo;
    this.logger.info(`Created Kudo ${kudo.id}`);
    return kudo;
  }

  private async createPerson(mutationVariables: CreatePersonMutationVariables): Promise<Person> {
    this.logger.info(`Creating a person with the username ${mutationVariables.input.username}`);
    const input: CreatePersonInput = {
      ...mutationVariables.input,
    };
    const createPersonResponse = await this.graphQLClient.request<CreatePersonMutation, CreatePersonMutationVariables>(createPerson, {
      ...mutationVariables,
      input,
    });
    this.logger.http(JSON.stringify(createPersonResponse));
    const person = createPersonResponse.createPerson as Person;
    return person;
  }

  private async getUser(username: string, dataSource: DataSourceApp): Promise<Person | null> {
    this.logger.info(`Getting user for username ${username}`);

    const peopleResponse = await this.listPeople({
      filter: {
        username: { eq: username },
        dataSourceApp: { eq: dataSource },
      },
    });

    const people = peopleResponse.items as Person[];
    this.logger.info(`Found ${people.length} users`);

    if (people.length === 0) {
      return null;
    }
    if (people.length > 1) {
      this.logger.warn(`Found more than one user for username ${username}`);
    }

    // Sort the array to get the newest (just in case there are more than 1)
    people.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    const person = people[0];
    return person;
  }
}
