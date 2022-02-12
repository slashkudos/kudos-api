import { CreateKudoMutationVariables, CreatePersonMutationVariables, Kudo, Person } from "../API";
import { KudosApiClient } from "../KudosApiClient";

// Spy Instances
const getUserFunc = jest.spyOn(KudosApiClient.prototype as any, "getUser") as unknown as jest.SpyInstance<Promise<Person | null>, [username: string]>;
const createPersonFunc = jest.spyOn(KudosApiClient.prototype as any, "createPerson") as unknown as jest.SpyInstance<
  Promise<Person>,
  [mutationVariables: CreatePersonMutationVariables]
>;
const sendCreateKudoRequestFunc = jest.spyOn(KudosApiClient.prototype as any, "sendCreateKudoRequest") as unknown as jest.SpyInstance<
  Promise<Kudo>,
  [mutationVariables: CreateKudoMutationVariables]
>;

beforeEach(() => {
  getUserFunc.mockClear();
  createPersonFunc.mockClear();
  sendCreateKudoRequestFunc.mockClear();
});

test("Create Kudo Happy Path", () => {
  const receiverUsername = "testReceiverUsername";
  const giverUsername = "testGiverUsername";

  getUserFunc.mockImplementation((username: string): Promise<Person | null> => {
    if (username === receiverUsername) return Promise.resolve({ id: receiverUsername } as Person);
    else return Promise.resolve({ id: giverUsername } as Person);
  });
  createPersonFunc.mockImplementation(() => Promise.resolve({} as Person));
  sendCreateKudoRequestFunc.mockImplementation(() =>
    Promise.resolve({ id: "testKudoId", receiver: { id: receiverUsername, kudosReceived: { items: [{ id: "testKudoReceivedId" }] } } } as Kudo)
  );

  KudosApiClient.build({ ApiKey: "TestApiKey", ApiUrl: "TestApiUrl" }).then((client) => {
    client.createKudo(giverUsername, receiverUsername, "testMessage", "testTweetId").then((kudo) => {
      expect(getUserFunc.mock.calls.length).toBe(2);
      expect(getUserFunc.mock.calls[0][0]).toBe(giverUsername);
      expect(getUserFunc.mock.calls[1][0]).toBe(receiverUsername);
      expect(createPersonFunc.mock.calls.length).toBe(0);
      expect(kudo).not.toBeNull();
    });
  });
});

test("Create Kudo with a new receiver", () => {
  const receiverUsername = "testReceiverUsername";
  const giverUsername = "testGiverUsername";

  getUserFunc.mockImplementation((username: string): Promise<Person | null> => {
    if (username === receiverUsername) return Promise.resolve(null);
    else return Promise.resolve({ id: giverUsername } as Person);
  });
  createPersonFunc.mockImplementation(() => Promise.resolve({ id: receiverUsername } as Person));
  sendCreateKudoRequestFunc.mockImplementation(() =>
    Promise.resolve({ id: "testKudoId", receiver: { id: receiverUsername, kudosReceived: { items: [{ id: "testKudoReceivedId" }] } } } as Kudo)
  );

  KudosApiClient.build({ ApiKey: "TestApiKey", ApiUrl: "TestApiUrl" }).then((client) => {
    client.createKudo(giverUsername, receiverUsername, "testMessage", "testTweetId").then((kudo) => {
      expect(createPersonFunc.mock.calls.length).toBe(1);
      expect(createPersonFunc.mock.calls[0][0].input.username).toBe(receiverUsername);
      expect(kudo).not.toBeNull();
    });
  });
});

test("Create kudo with a new giver", () => {
  const receiverUsername = "testReceiverUsername";
  const giverUsername = "testGiverUsername";

  const getUserFunc = jest.spyOn(KudosApiClient.prototype as any, "getUser") as unknown as jest.SpyInstance<Promise<Person | null>, [username: string]>;
  getUserFunc.mockImplementation((username: string): Promise<Person | null> => {
    if (username === giverUsername) return Promise.resolve(null);
    else return Promise.resolve({ id: receiverUsername } as Person);
  });

  const createPersonFunc = jest.spyOn(KudosApiClient.prototype as any, "createPerson") as unknown as jest.SpyInstance<
    Promise<Person>,
    [mutationVariables: CreatePersonMutationVariables]
  >;
  createPersonFunc.mockImplementation(() => Promise.resolve({ id: giverUsername } as Person));

  const sendCreateKudoRequestFunc = jest.spyOn(KudosApiClient.prototype as any, "sendCreateKudoRequest") as unknown as jest.SpyInstance<
    Promise<Kudo>,
    [mutationVariables: CreateKudoMutationVariables]
  >;
  sendCreateKudoRequestFunc.mockImplementation(() =>
    Promise.resolve({ id: "testKudoId", receiver: { id: receiverUsername, kudosReceived: { items: [{ id: "testKudoReceivedId" }] } } } as Kudo)
  );

  KudosApiClient.build({ ApiKey: "TestApiKey", ApiUrl: "TestApiUrl" }).then((client) => {
    client.createKudo(giverUsername, receiverUsername, "testMessage", "testTweetId").then((kudo) => {
      expect(createPersonFunc.mock.calls.length).toBe(1);
      expect(createPersonFunc.mock.calls[0][0].input.username).toBe(giverUsername);
      expect(kudo).not.toBeNull();
    });
  });
});
