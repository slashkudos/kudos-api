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
  ModelKudoFilterInput,
  ModelPersonConnection,
  ModelPersonFilterInput,
  ModelSortDirection,
  Person,
} from "./API";
import { listPeopleIds } from "./graphql/extensions";
import { createKudo, createPerson } from "./graphql/mutations";
import { kudosByDate, listKudos, listPeople } from "./graphql/queries";
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

  public async listPeople(queryVariables: ListPeopleQueryVariables, queryOverride?: string): Promise<ModelPersonConnection> {
    const query = queryOverride || listPeople;
    const listPeopleResponse = await this.graphQLClient.request<ListPeopleQuery, ListPeopleQueryVariables>(query, queryVariables);
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
    queryVariables: KudosByDateQueryVariables = { type: "Kudo", sortDirection: ModelSortDirection.DESC },
    queryOverride?: string
  ): Promise<ModelKudoConnection> {
    const defaultVariables = { type: "Kudo", sortDirection: ModelSortDirection.DESC };
    queryVariables = { ...defaultVariables, ...queryVariables };
    queryVariables.type = "Kudo";
    const query = queryOverride || kudosByDate;
    const listKudosResponse = await this.graphQLClient.request<KudosByDateQuery, KudosByDateQueryVariables>(query, queryVariables);
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
      const result = await this.listKudosByDate(queryVariables);
      this.logger.http(JSON.stringify(result));
      if (!result) {
        throw new Error("Expected kudosByDate to be returned from kudosByDateTotal");
      }
      total += result.items.length;
      nextToken = result.nextToken;
      queryVariables.nextToken = nextToken;
    } while (nextToken);

    this.logger.info(`Total kudos for ${username}: ${total}"`);

    return total;
  }

  public async searchKudosByUser(usernameSearchTerm: string): Promise<ModelKudoConnection> {
    const people = await this.searchPeople(usernameSearchTerm, { queryOverride: listPeopleIds });
    if (people.length === 0) {
      const result: ModelKudoConnection = {
        __typename: "ModelKudoConnection",
        items: [],
      };
      return result;
    }
    const personIdFilters: ModelKudoFilterInput[] = [];
    people.forEach((person) => {
      personIdFilters.push({ receiverId: { eq: person.id } }, { giverId: { eq: person.id } });
    });
    const queryVariables: KudosByDateQueryVariables = {
      type: "Kudo",
      filter: { or: personIdFilters },
    };
    const queryConnection = await this.listKudosByDate(queryVariables);
    return queryConnection;
  }

  public async searchPeople(usernameSearchTerm: string, options: { dataSourceApp?: DataSourceApp; queryOverride?: string }): Promise<Person[]> {
    this.logger.info(`Searching users with username ${usernameSearchTerm}`);

    // Search people by username
    const filter: ModelPersonFilterInput = {
      username: { contains: usernameSearchTerm },
    };
    if (options.dataSourceApp) {
      filter.dataSourceApp = { eq: options.dataSourceApp };
    }
    const peopleResponse = await this.listPeople(
      {
        filter: filter,
      },
      options.queryOverride
    );

    const people = peopleResponse.items as Person[];
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
