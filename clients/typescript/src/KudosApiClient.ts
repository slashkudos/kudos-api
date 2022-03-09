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
  SearchKudosQueryVariables,
} from "./API";
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

const searchKudosTotal = /* GraphQL */ `
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
    const rawResponse = await this.graphQLClient.request(listPeople, queryVariables);
    this.logger.http(JSON.stringify(rawResponse));
    const listPeopleResponse = rawResponse as ListPeopleQuery;
    if (!listPeopleResponse) {
      throw new Error("Expected a ListPeopleQuery response from listPeople");
    }
    const modelPersonConnection = listPeopleResponse.listPeople as ModelPersonConnection;
    return modelPersonConnection;
  }

  public async listKudos(queryVariables?: ListKudosQueryVariables): Promise<ModelKudoConnection> {
    const rawResponse = await this.graphQLClient.request(listKudos, queryVariables);
    this.logger.http(JSON.stringify(rawResponse));
    const listKudosResponse = rawResponse as ListKudosQuery;
    if (!listKudosResponse) {
      throw new Error("Expected a ListKudosQuery response from listKudos");
    }
    const modelKudoConnection = listKudosResponse.listKudos as ModelKudoConnection;
    return modelKudoConnection;
  }

  public async listKudosByDate(
    queryVariables: KudosByDateQueryVariables = { type: "Kudo", sortDirection: ModelSortDirection.DESC }
  ): Promise<ModelKudoConnection> {
    queryVariables.type = "Kudo";
    const rawResponse = await this.graphQLClient.request(kudosByDate, queryVariables);
    this.logger.http(JSON.stringify(rawResponse));
    const listKudosResponse = rawResponse as KudosByDateQuery;
    if (!listKudosResponse) {
      throw new Error("Expected a ListKudosQuery response from listKudos");
    }
    const modelKudoConnection = listKudosResponse.kudosByDate as ModelKudoConnection;
    return modelKudoConnection;
  }

  public async getTotalKudosForReceiver(username: string, dataSource: DataSourceApp): Promise<number | null | undefined> {
    const receiver = await this.getUser(username, dataSource);
    if (!receiver) {
      return null;
    }
    const queryVariables: SearchKudosQueryVariables = {
      filter: {
        receiverId: { eq: receiver.id },
        dataSourceApp: { eq: dataSource },
      },
    };
    const result = await this.graphQLClient.request<SearchableKudoConnection>(searchKudosTotal, queryVariables);
    return result.total;
  }

  private async sendCreateKudoRequest(mutationVariables: CreateKudoMutationVariables): Promise<Kudo> {
    this.logger.info(`Sending create kudo request`);
    const input: CreateKudoInput = {
      ...mutationVariables.input,
      kudoVerb: KudoVerb.kudos,
    };
    const rawResponse = await this.graphQLClient.request(createKudo, {
      ...mutationVariables,
      input,
    });
    this.logger.http(JSON.stringify(rawResponse));
    const createKudoResponse = rawResponse as CreateKudoMutation;
    if (!createKudoResponse) {
      throw new Error("Expected a CreateKudoMutation response from createKudo");
    }
    const kudo = createKudoResponse.createKudo as Kudo;
    this.logger.info(`Created Kudo ${kudo.id}`);
    return kudo;
  }

  private async createPerson(mutationVariables: CreatePersonMutationVariables): Promise<Person> {
    this.logger.info(`Creating a person with the username ${mutationVariables.input.username}`);
    const input: CreatePersonInput = {
      ...mutationVariables.input,
    };
    const rawResponse = await this.graphQLClient.request(createPerson, {
      ...mutationVariables,
      input,
    });
    this.logger.http(JSON.stringify(rawResponse));
    const createPersonResponse = rawResponse as CreatePersonMutation;
    if (!createPersonResponse) {
      throw new Error("Expected a CreatePersonMutation response from createPerson");
    }
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

    // Sort the array to get the newest (just in case there are more than 1)
    people.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    const person = people[0];
    return person;
  }
}
