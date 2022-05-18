/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSourceApp } from "../../API";
import { KudosApiClient } from "../../KudosApiClient";

const apiUrl = process.env.API_URL || "http://localhost:20002/graphql";
if (!apiUrl) {
  throw new Error("API_URL environment variable is not set");
}
const apiKey = process.env.API_KEY || "da2-fakeApiId123456";
const receiverUsername = "testReceiverUsername";
const giverUsername = "testGiverUsername";

describe("kudos client", () => {
  it("creates twitter kudos", async () => {
    const receiverProfileImageUrl = "https://slashkudos.com/receiverProfileImageUrl";
    const giverProfileImageUrl = "https://slashkudos.com/receiverProfileImageUrl/giverProfileImageUrl";
    const message = "testMessage";
    const tweetId = "testTweetId";

    const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
    const test1 = await kudosClient.createKudo({
      giverUsername,
      receiverUsername,
      message: message,
      tweetId: tweetId,
      giverProfileImageUrl,
      receiverProfileImageUrl,
      dataSource: DataSourceApp.twitter,
    });
    expect(test1.kudo.message).toEqual(message);
    expect(test1.kudo.giver?.username).toEqual(giverUsername);
    expect(test1.kudo.giver?.profileImageUrl).toEqual(giverProfileImageUrl);
    expect(test1.kudo.receiver?.username).toEqual(receiverUsername);
    expect(test1.kudo.receiver?.profileImageUrl).toEqual(receiverProfileImageUrl);
    expect(test1.receiver.kudosReceived?.items.length).toBeGreaterThanOrEqual(1);

    // Create another kudo to test sort by date
    await new Promise((r) => setTimeout(r, 500));

    const message2 = "testMessage2";
    const test2 = await kudosClient.createKudo({
      giverUsername,
      receiverUsername,
      message: message2,
      tweetId: tweetId,
      giverProfileImageUrl,
      receiverProfileImageUrl,
      dataSource: DataSourceApp.twitter,
    });
    expect(test2.kudo.message).toEqual(message2);
    expect(test2.kudo.giver?.username).toEqual(giverUsername);
    expect(test2.kudo.giver?.profileImageUrl).toEqual(giverProfileImageUrl);
    expect(test2.kudo.receiver?.username).toEqual(receiverUsername);
    expect(test2.kudo.receiver?.profileImageUrl).toEqual(receiverProfileImageUrl);
    expect(test2.receiver.kudosReceived?.items.length).toBeGreaterThanOrEqual(2);
  });

  it("throws exception with bad url", async () => {
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
      const sorted = kudos.items.slice().sort((a, b) => Date.parse(b!.createdAt) - Date.parse(a!.createdAt));
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(kudos.items[i]?.createdAt).toBe(sorted[i]?.createdAt);
      }
    });

    it("lists kudos by date with bad type should still work", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudosByDate({ type: "badType" });
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toBeGreaterThanOrEqual(1);
      const sorted = kudos.items.slice().sort((a, b) => Date.parse(b!.createdAt) - Date.parse(a!.createdAt));
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(kudos.items[i]?.createdAt).toBe(sorted[i]?.createdAt);
      }
    });

    it("lists kudos by date with no sort order", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudosByDate({ type: "Kudo" });
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toBeGreaterThanOrEqual(1);
      const sorted = kudos.items.slice().sort((a, b) => Date.parse(b!.createdAt) - Date.parse(a!.createdAt));
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(kudos.items[i]?.createdAt).toBe(sorted[i]?.createdAt);
      }
    });

    it("get total kudos for receiver", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const total = await kudosClient.getTotalKudosForReceiver(receiverUsername, DataSourceApp.twitter);
      expect(total).toBeGreaterThanOrEqual(1);
    });

    it("search kudos by username partial", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser("testReceiverUser");
      expect(connection.items.length).toBeGreaterThanOrEqual(1);
    });

    it("search kudos by username exact", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername);
      expect(connection.items.length).toBeGreaterThanOrEqual(1);
    });

    it("search kudos by receiver with pagination", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername, 1);
      expect(connection.items.length).toEqual(1);
      expect(connection.nextToken).not.toBeNull();
    });

    it("search kudos by giver with pagination", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(giverUsername, 1);
      expect(connection.items.length).toEqual(1);
      expect(connection.nextToken).not.toBeNull();
    });

    it("search kudos by username different casing does NOT work", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser("testreceiverusername");
      expect(connection.items.length).toBe(0);
    });
  });
});
