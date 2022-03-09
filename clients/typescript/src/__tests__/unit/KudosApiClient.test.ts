/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateKudoMutationVariables, CreatePersonMutationVariables, DataSourceApp, Kudo, Person } from "../../API";
import { KudosApiClient } from "../../KudosApiClient";

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

test("Create twitter Kudo Happy Path", () => {
  const receiverUsername = "testReceiverUsername";
  const receiverProfileImageUrl = "testReceiverProfileImageUrl";
  const giverUsername = "testGiverUsername";
  const giverProfileImageUrl = "testGiverProfileImageUrl";

  getUserFunc.mockImplementation((username: string): Promise<Person | null> => {
    if (username === receiverUsername) return Promise.resolve({ id: receiverUsername } as Person);
    else return Promise.resolve({ id: giverUsername } as Person);
  });
  createPersonFunc.mockImplementation(() => Promise.resolve({} as Person));
  sendCreateKudoRequestFunc.mockImplementation(() =>
    Promise.resolve({ id: "testKudoId", receiver: { id: receiverUsername, kudosReceived: { items: [{ id: "testKudoReceivedId" }] } } } as Kudo)
  );

  return KudosApiClient.build({ ApiKey: "TestApiKey", ApiUrl: "TestApiUrl" }).then((client) => {
    client
      .createKudo({
        giverUsername,
        receiverUsername,
        message: "testMessage",
        tweetId: "testTweetId",
        giverProfileImageUrl,
        receiverProfileImageUrl,
        dataSource: DataSourceApp.twitter,
      })
      .then((kudo) => {
        expect(getUserFunc.mock.calls.length).toBe(2);
        expect(getUserFunc.mock.calls[0][0]).toBe(giverUsername);
        expect(getUserFunc.mock.calls[1][0]).toBe(receiverUsername);
        expect(createPersonFunc.mock.calls.length).toBe(0);
        expect(kudo).not.toBeNull();
      });
  });
});

test("Create twitter Kudo with a new receiver", () => {
  const receiverUsername = "testReceiverUsername";
  const receiverProfileImageUrl = "testReceiverProfileImageUrl";
  const giverUsername = "testGiverUsername";
  const giverProfileImageUrl = "testGiverProfileImageUrl";

  getUserFunc.mockImplementation((username: string): Promise<Person | null> => {
    if (username === receiverUsername) return Promise.resolve(null);
    else return Promise.resolve({ id: giverUsername } as Person);
  });
  createPersonFunc.mockImplementation(() => Promise.resolve({ id: receiverUsername } as Person));
  sendCreateKudoRequestFunc.mockImplementation(() =>
    Promise.resolve({ id: "testKudoId", receiver: { id: receiverUsername, kudosReceived: { items: [{ id: "testKudoReceivedId" }] } } } as Kudo)
  );

  return KudosApiClient.build({ ApiKey: "TestApiKey", ApiUrl: "TestApiUrl" }).then((client) => {
    client
      .createKudo({
        giverUsername,
        receiverUsername,
        message: "testMessage",
        tweetId: "testTweetId",
        receiverProfileImageUrl,
        giverProfileImageUrl,
        dataSource: DataSourceApp.twitter,
      })
      .then((kudo) => {
        expect(createPersonFunc.mock.calls.length).toBe(1);
        expect(createPersonFunc.mock.calls[0][0].input.username).toBe(receiverUsername);
        expect(kudo).not.toBeNull();
      });
  });
});

test("Create twitter kudo with a new giver", () => {
  const receiverUsername = "testReceiverUsername";
  const receiverProfileImageUrl = "testReceiverProfileImageUrl";
  const giverUsername = "testGiverUsername";
  const giverProfileImageUrl = "testGiverProfileImageUrl";

  getUserFunc.mockImplementation((username: string): Promise<Person | null> => {
    if (username === giverUsername) return Promise.resolve(null);
    else return Promise.resolve({ id: receiverUsername } as Person);
  });
  createPersonFunc.mockImplementation(() => Promise.resolve({ id: giverUsername } as Person));
  sendCreateKudoRequestFunc.mockImplementation(() =>
    Promise.resolve({ id: "testKudoId", receiver: { id: receiverUsername, kudosReceived: { items: [{ id: "testKudoReceivedId" }] } } } as Kudo)
  );

  return KudosApiClient.build({ ApiKey: "TestApiKey", ApiUrl: "TestApiUrl" }).then((client) => {
    client
      .createKudo({
        giverUsername,
        receiverUsername,
        message: "testMessage",
        tweetId: "testTweetId",
        receiverProfileImageUrl,
        giverProfileImageUrl,
        dataSource: DataSourceApp.twitter,
      })
      .then((kudo) => {
        expect(createPersonFunc.mock.calls.length).toBe(1);
        expect(createPersonFunc.mock.calls[0][0].input.username).toBe(giverUsername);
        expect(kudo).not.toBeNull();
      });
  });
});
