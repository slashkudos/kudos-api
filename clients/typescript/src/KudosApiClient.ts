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
  KudoVerb,
  ListKudosQuery,
  ListKudosQueryVariables,
  ListPersonsQuery,
  ListPersonsQueryVariables,
  ModelKudoConnection,
  ModelPersonConnection,
  Person,
} from "./API";
import { createKudo, createPerson } from "./graphql/mutations";
import { listKudos, listPersons } from "./graphql/queries";
import { LoggerService } from "./LoggerService";

export interface KudosGraphQLConfig {
  ApiKey: string;
  ApiUrl: string;
}

export interface createTwitterKudoOptions {
  giverUsername: string;
  receiverUsername: string;
  message: string;
  tweetId: string;
  giverProfileImageUrl: string;
  receiverProfileImageUrl: string;
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

  public async createTwitterKudo(options: createTwitterKudoOptions): Promise<{ kudo: Kudo; receiver: Person }> {
    this.logger.info(`Creating Kudo from ${options.giverUsername} to ${options.receiverUsername} with message "${options.message}"`);
    let giver: Person | null = await this.getTwitterUser(options.giverUsername);
    if (!giver) {
      giver = await this.createTwitterPerson({
        input: {
          username: options.giverUsername,
          dataSourceApp: DataSourceApp.twitter,
          profileImageUrl: options.giverProfileImageUrl,
        },
      });
    }
    let receiver: Person | null = await this.getTwitterUser(options.receiverUsername);
    if (!receiver) {
      receiver = await this.createTwitterPerson({
        input: {
          username: options.receiverUsername,
          dataSourceApp: DataSourceApp.twitter,
          profileImageUrl: options.receiverProfileImageUrl,
        },
      });
    }

    const tweetUrl = `https://twitter.com/${options.giverUsername}/status/${options.tweetId}`;
    const kudo = await this.sendCreateTwitterKudoRequest({
      input: {
        giverId: giver.id,
        receiverId: receiver.id,
        message: options.message,
        link: tweetUrl,
        dataSourceApp: DataSourceApp.twitter,
        kudoVerb: KudoVerb.kudos,
      },
    });

    if (!kudo.receiver) {
      throw new Error("Expected a receiver on the kudo");
    }
    if (!kudo.receiver?.kudosReceived?.items) {
      throw new Error("Expected receiver kudosReceived to be returned from sendCreateTwitterKudoRequest");
    }

    return { kudo, receiver: kudo.receiver };
  }

  public async listPeople(queryVariables: ListPersonsQueryVariables): Promise<ModelPersonConnection> {
    const rawResponse = await this.graphQLClient.request(listPersons, queryVariables);
    this.logger.http(JSON.stringify(rawResponse));
    const listPersonsResponse = rawResponse as ListPersonsQuery;
    if (!listPersonsResponse) {
      throw new Error("Expected a ListPersonsQuery response from listPersons");
    }
    const modelPersonConnection = listPersonsResponse.listPersons as ModelPersonConnection;
    return modelPersonConnection;
  }

  public async listKudos(queryVariables: ListKudosQueryVariables): Promise<ModelKudoConnection> {
    const rawResponse = await this.graphQLClient.request(listKudos, queryVariables);
    this.logger.http(JSON.stringify(rawResponse));
    const listKudosResponse = rawResponse as ListKudosQuery;
    if (!listKudosResponse) {
      throw new Error("Expected a ListKudosQuery response from listKudos");
    }
    const modelKudoConnection = listKudosResponse.listKudos as ModelKudoConnection;
    return modelKudoConnection;
  }

  private async sendCreateTwitterKudoRequest(mutationVariables: CreateKudoMutationVariables): Promise<Kudo> {
    this.logger.info(`Sending create kudo request`);
    const input: CreateKudoInput = {
      ...mutationVariables.input,
      dataSourceApp: DataSourceApp.twitter,
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

  private async createTwitterPerson(mutationVariables: CreatePersonMutationVariables): Promise<Person> {
    this.logger.info(`Creating a person with the username ${mutationVariables.input.username}`);
    const input: CreatePersonInput = {
      ...mutationVariables.input,
      dataSourceApp: DataSourceApp.twitter,
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

  private async getTwitterUser(username: string): Promise<Person | null> {
    this.logger.info(`Getting user for username ${username}`);

    const peopleResponse = await this.listPeople({
      filter: {
        username: { eq: username },
        dataSourceApp: { eq: DataSourceApp.twitter },
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
