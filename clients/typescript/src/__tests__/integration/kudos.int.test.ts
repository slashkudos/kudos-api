/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSourceApp } from "../../API";
import { KudosApiClient } from "../../KudosApiClient";

const apiUrl = process.env.API_URL || "http://localhost:20002/graphql";
if (!apiUrl) {
  throw new Error("API_URL environment variable is not set");
}
const apiKey = process.env.API_KEY || "da2-fakeApiId123456";

describe("kudos client", () => {
  it("creates twitter kudos for new users", async () => {
    const receiverUsername = "testReceiverUsername";
    const receiverProfileImageUrl = "https://slashkudos.com/receiverProfileImageUrl";
    const giverUsername = "testGiverUsername";
    const giverProfileImageUrl = "https://slashkudos.com/receiverProfileImageUrl/giverProfileImageUrl";
    const message = "testMessage";
    const tweetId = "testTweetId";

    const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
    const { kudo, receiver } = await kudosClient.createKudo({
      giverUsername,
      receiverUsername,
      message: message,
      tweetId: tweetId,
      giverProfileImageUrl,
      receiverProfileImageUrl,
      dataSource: DataSourceApp.twitter,
    });
    expect(kudo.message).toEqual(message);
    expect(kudo.giver?.username).toEqual(giverUsername);
    expect(kudo.giver?.profileImageUrl).toEqual(giverProfileImageUrl);
    expect(kudo.receiver?.username).toEqual(receiverUsername);
    expect(kudo.receiver?.profileImageUrl).toEqual(receiverProfileImageUrl);
    expect(receiver.kudosReceived?.items.length).toBeGreaterThanOrEqual(1);
  });

  it("throws exception with bad url", async () => {
    const receiverUsername = "testReceiverUsername";
    const receiverProfileImageUrl = "https://slashkudos.com/receiverProfileImageUrl";
    const giverUsername = "bad url username";
    const giverProfileImageUrl = "bad url";

    const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
    expect(
      async () =>
        await kudosClient.createKudo({
          giverUsername,
          receiverUsername,
          message: "testMessage",
          tweetId: "testTweetId",
          giverProfileImageUrl,
          receiverProfileImageUrl,
          dataSource: DataSourceApp.twitter,
        })
    ).rejects.toThrow();
  });

  describe("after kudos are created", () => {
    it("lists kudos with no filters", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudos();
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toBeGreaterThanOrEqual(1);
    });

    it("lists kudos by date", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudosByDate();
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toBeGreaterThanOrEqual(1);
    });

    it("lists kudos by date with bad type", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudosByDate({ type: "badType" });
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toBeGreaterThanOrEqual(1);
    });

    // @searchable mocking is not supported. Search queries will not work as expected.
    it.skip("get total kudos for receiver", async () => {
      const receiverUsername = "testReceiverUsername";
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const total = await kudosClient.getTotalKudosForReceiver(receiverUsername, DataSourceApp.twitter);
      expect(total).toBeGreaterThanOrEqual(1);
    });

    it.skip("search kudos by username partial", async () => {
      const receiverUsername = "testReceiverUser";
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername);
      expect(connection.total).toBeGreaterThanOrEqual(1);
      expect(connection.items.length).toBeGreaterThanOrEqual(1);
    });

    it.skip("search kudos by username exact", async () => {
      const receiverUsername = "testReceiverUsername";
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername);
      expect(connection.total).toBeGreaterThanOrEqual(1);
      expect(connection.items.length).toBeGreaterThanOrEqual(1);
    });

    it.skip("search kudos by username different casing", async () => {
      const receiverUsername = "testreceiverusername";
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername);
      expect(connection.total).toBeGreaterThanOrEqual(1);
      expect(connection.items.length).toBeGreaterThanOrEqual(1);
    });
  });
});
