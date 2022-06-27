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
  UpdateKudoMutation,
  UpdateKudoMutationVariables,
  UpdatePersonMutation,
  UpdatePersonMutationVariables,
} from "./API";
import { kudosByDateTotal, listPeopleIds } from "./graphql/extensions";
import { createKudo, createPerson, updateKudo, updatePerson } from "./graphql/mutations";
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
  link: string;
  giverProfileUrl?: string;
  receiverProfileUrl?: string;
  giverProfileImageUrl?: string;
  receiverProfileImageUrl?: string;
  metadata?: object;
}

export type Role = "giver" | "receiver" | "any";

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
          profileUrl: options.giverProfileUrl,
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
          profileUrl: options.receiverProfileUrl,
          profileImageUrl: options.receiverProfileImageUrl,
        },
      });
    }

    let metadata: string | undefined = undefined;
    if (options.metadata) {
      metadata = JSON.stringify(options.metadata);
    }

    const kudo = await this.sendCreateKudoRequest({
      input: {
        giverId: giver.id,
        receiverId: receiver.id,
        message: options.message,
        link: options.link,
        dataSourceApp: options.dataSource,
        kudoVerb: KudoVerb.kudos,
        metadata: metadata,
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

  public async listPeople(queryVariables: ListPeopleQueryVariables, queryOverride?: string): Promise<ModelPersonConnection> {
    const query = queryOverride || listPeople;
    const listPeopleResponse = await this.graphQLClient.request<ListPeopleQuery, ListPeopleQueryVariables>(query, queryVariables);
    this.logger.http(JSON.stringify(listPeopleResponse));
    const modelPersonConnection = listPeopleResponse.listPeople as ModelPersonConnection;
    this.savePersonUsernameLower(modelPersonConnection);
    return modelPersonConnection;
  }

  public async listKudos(queryVariables?: ListKudosQueryVariables): Promise<ModelKudoConnection> {
    const listKudosResponse = await this.graphQLClient.request<ListKudosQuery, ListKudosQueryVariables>(listKudos, queryVariables);
    this.logger.http(JSON.stringify(listKudosResponse));
    const modelKudoConnection = listKudosResponse.listKudos as ModelKudoConnection;
    this.saveKudoMessageLower(modelKudoConnection);
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
    this.logger.debug(`Query variables: ${JSON.stringify(queryVariables)}}`);
    const listKudosResponse = await this.graphQLClient.request<KudosByDateQuery, KudosByDateQueryVariables>(query, queryVariables);
    this.logger.http(JSON.stringify(listKudosResponse));
    const modelKudoConnection = listKudosResponse.kudosByDate as ModelKudoConnection;
    this.saveKudoMessageLower(modelKudoConnection);
    return modelKudoConnection;
  }

  public async getTotalKudosForUser(
    username: string,
    options?: {
      dataSource?: DataSourceApp;
      role?: Role;
    }
  ): Promise<number | null | undefined> {
    if (!options) options = {};
    if (!options.role) {
      options.role = "receiver";
    }
    let total = 0;
    let nextToken: string | null | undefined;

    do {
      const result = await this.searchKudosByUser(username, {
        listKudosByDateQueryOverride: kudosByDateTotal,
        limit: 1000,
        nextToken,
        dataSource: options.dataSource,
        role: options.role,
      });
      if (!result) {
        throw new Error("Expected kudosByDate to be returned from kudosByDateTotal");
      }
      total += result.items.length;
      nextToken = result.nextToken;
    } while (nextToken);

    this.logger.info(`Total kudos for ${username}: ${total}"`);

    return total;
  }

  // Note about pagination - The limit will be applied first, then the filter.
  // https://github.com/aws-amplify/amplify-js/issues/2358
  public async searchKudosByUser(
    usernameSearchTerm: string,
    options?: {
      limit?: number | null;
      nextToken?: string | null;
      dataSource?: DataSourceApp;
      listKudosByDateQueryOverride?: string;
      role?: Role;
    }
  ): Promise<ModelKudoConnection> {
    if (!options) {
      options = {};
    }
    options.limit = options.limit || 25;
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
      const receiverFilter: ModelKudoFilterInput = { receiverId: { eq: person.id } };
      const giverFilter: ModelKudoFilterInput = { giverId: { eq: person.id } };
      const filters: ModelKudoFilterInput[] = [];
      if (options?.role && options.role !== "any") {
        if (options.role === "receiver") {
          filters.push(receiverFilter);
        } else {
          filters.push(giverFilter);
        }
      } else {
        filters.push(receiverFilter, giverFilter);
      }
      personIdFilters.push({ or: filters });
    });
    const filter: ModelKudoFilterInput = { or: personIdFilters };
    if (options?.dataSource) {
      filter.and = [{ dataSourceApp: { eq: options?.dataSource } }];
    }
    const queryVariables: KudosByDateQueryVariables = {
      type: "Kudo",
      filter: filter,
      limit: options.limit,
      nextToken: options.nextToken,
    };
    const queryConnection = await this.listKudosByDate(queryVariables, options?.listKudosByDateQueryOverride);
    return queryConnection;
  }

  public async searchPeople(usernameSearchTerm: string, options: { dataSourceApp?: DataSourceApp; queryOverride?: string }): Promise<Person[]> {
    this.logger.info(`Searching users with username ${usernameSearchTerm}\nOptions: ${JSON.stringify(options)}`);
    const usernameSearchTermLower = usernameSearchTerm.toLowerCase();

    // Search people by username
    // FIXME - Remove OR and only search by usernameLower once it is populated everywhere
    const filter: ModelPersonFilterInput = {
      or: [{ username: { contains: usernameSearchTerm } }, { usernameLower: { contains: usernameSearchTermLower } }],
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
      messageLower: mutationVariables.input.message.toLowerCase(),
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
      usernameLower: mutationVariables.input.username.toLowerCase(),
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

  // FIXME - remove once all users are saved with lowercase usernames
  private async savePersonUsernameLower(modelPersonConnection: ModelPersonConnection): Promise<void> {
    for (const person of modelPersonConnection.items) {
      if (person && person.username && !person.usernameLower) {
        try {
          this.logger.info(`Saving usernameLower for "${person.username}"`);
          person.usernameLower = person.username.toLowerCase();
          await this.graphQLClient.request<UpdatePersonMutation, UpdatePersonMutationVariables>(updatePerson, {
            input: { id: person.id, usernameLower: person.usernameLower },
          });
        } catch (error) {
          this.logger.error(`Error updating person usernameLower: ${error}`);
        }
      }
    }
  }

  // FIXME - remove once all kudos are saved with lowercase messages
  private async saveKudoMessageLower(modelKudoConnection: ModelKudoConnection): Promise<void> {
    for (const kudo of modelKudoConnection.items) {
      if (kudo && kudo.message && !kudo.messageLower) {
        try {
          this.logger.info(`Saving messageLower for "${kudo.message}"`);
          kudo.messageLower = kudo.message.toLowerCase();
          await this.graphQLClient.request<UpdateKudoMutation, UpdateKudoMutationVariables>(updateKudo, {
            input: { id: kudo.id, messageLower: kudo.messageLower },
          });
        } catch (error) {
          this.logger.error(`Error updating kudo messageLower: ${error}`);
        }
      }
    }
  }
}
