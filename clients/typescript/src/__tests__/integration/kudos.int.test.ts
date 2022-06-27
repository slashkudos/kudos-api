/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
const totalTwitterKudos = 3;
const totalKudos = 4;

describe("kudos client", () => {
  it("creates twitter kudos", async () => {
    const receiverProfileImageUrl = "https://slashkudos.com/receiverProfileImageUrl";
    const giverProfileUrl = "https://slashkudos.com/receiverProfileImageUrl/giverProfileUrl";
    const giverProfileImageUrl = "https://slashkudos.com/receiverProfileImageUrl/giverProfileImageUrl";
    const message = "testMessage";
    const tweetId = "testTweetId";
    const link = `https://twitter.com/${giverUsername}/status/${tweetId}`;

    const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
    const test1 = await kudosClient.createKudo({
      giverUsername,
      receiverUsername,
      message: message,
      link,
      giverProfileUrl,
      giverProfileImageUrl,
      receiverProfileImageUrl,
      dataSource: DataSourceApp.twitter,
    });
    expect(test1.kudo.message).toEqual(message);
    expect(test1.kudo.giver?.username).toEqual(giverUsername);
    expect(test1.kudo.giver?.profileImageUrl).toEqual(giverProfileImageUrl);
    expect(test1.kudo.receiver?.username).toEqual(receiverUsername);
    expect(test1.kudo.receiver?.profileImageUrl).toEqual(receiverProfileImageUrl);
    expect(test1.receiver.kudosReceived?.items.length).toEqual(1);

    // Create another kudo to test sort by date
    await new Promise((r) => setTimeout(r, 500));

    const message2 = "testMessage2";
    const test2 = await kudosClient.createKudo({
      giverUsername,
      receiverUsername,
      message: message2,
      link,
      giverProfileImageUrl,
      receiverProfileImageUrl,
      dataSource: DataSourceApp.twitter,
    });
    expect(test2.kudo.message).toEqual(message2);
    expect(test2.kudo.giver?.username).toEqual(giverUsername);
    expect(test2.kudo.giver?.profileImageUrl).toEqual(giverProfileImageUrl);
    expect(test2.kudo.receiver?.username).toEqual(receiverUsername);
    expect(test2.kudo.receiver?.profileImageUrl).toEqual(receiverProfileImageUrl);
    expect(test2.receiver.kudosReceived?.items.length).toEqual(2);

    // Create a third for pagination testing
    await kudosClient.createKudo({
      giverUsername,
      receiverUsername,
      message: "testing pagination",
      link,
      giverProfileImageUrl,
      receiverProfileImageUrl,
      dataSource: DataSourceApp.twitter,
    });

    // Test saving a kudo with metadata
    await kudosClient.createKudo({
      giverUsername,
      receiverUsername,
      message: "testing metadata",
      link,
      giverProfileImageUrl,
      receiverProfileImageUrl,
      dataSource: DataSourceApp.github,
      metadata: { repo: "repo", owner: "owner", public: false },
    });
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
          link: `https://twitter.com/${giverUsername}/status/testTweetId`,
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
      expect(kudos.items.length).toEqual(totalKudos);
    });

    it("lists kudos by date", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudosByDate();
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toEqual(totalKudos);
      const sorted = kudos.items.slice().sort((a, b) => Date.parse(b!.createdAt) - Date.parse(a!.createdAt));
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(kudos.items[i]?.createdAt).toBe(sorted[i]?.createdAt);
      }
    });

    it("lists kudos by date with bad type should still work", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudosByDate({ type: "badType" });
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toEqual(totalKudos);
      const sorted = kudos.items.slice().sort((a, b) => Date.parse(b!.createdAt) - Date.parse(a!.createdAt));
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(kudos.items[i]?.createdAt).toBe(sorted[i]?.createdAt);
      }
    });

    it("lists kudos by date with no sort order", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudosByDate({ type: "Kudo" });
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toEqual(totalKudos);
      const sorted = kudos.items.slice().sort((a, b) => Date.parse(b!.createdAt) - Date.parse(a!.createdAt));
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(kudos.items[i]?.createdAt).toBe(sorted[i]?.createdAt);
      }
    });

    it("get total kudos for receiver on twitter", async () => {
      console.log("get total kudos for receiver on twitter");
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const total = await kudosClient.getTotalKudosForUser(receiverUsername, { dataSource: DataSourceApp.twitter });
      expect(total).toEqual(totalTwitterKudos);
    });

    it("get total kudos for receiver anywhere", async () => {
      console.log("get total kudos for receiver anywhere");
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const total = await kudosClient.getTotalKudosForUser(receiverUsername);
      expect(total).toEqual(totalKudos);
    });

    it("get total kudos received by giver anywhere", async () => {
      console.log("get total kudos received by giver anywhere");
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const total = await kudosClient.getTotalKudosForUser(giverUsername, { role: "receiver" });
      expect(total).toEqual(0);
    });

    it("get total kudos given by giver anywhere", async () => {
      console.log("get total kudos given by giver anywhere");
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const total = await kudosClient.getTotalKudosForUser(giverUsername, { role: "giver" });
      expect(total).toEqual(totalKudos);
    });

    it("search kudos by username partial", async () => {
      console.log("search kudos by username partial");
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser("testReceiverUser");
      expect(connection.items.length).toEqual(totalKudos);
    });

    it("search kudos by username exact", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername);
      expect(connection.items.length).toEqual(totalKudos);
    });

    it("search kudos by username and data source", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername, { dataSource: DataSourceApp.twitter });
      expect(connection.items.length).toEqual(totalTwitterKudos);
    });

    it("metadata is properly stored", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername);
      const metadata = connection.items.find((kudo) => kudo?.message === "testing metadata")?.metadata;
      expect(metadata).toBeTruthy();
      const parsed = JSON.parse(metadata!);
      expect(parsed.repo).toEqual("repo");
      expect(parsed.owner).toEqual("owner");
      expect(parsed.public).toEqual(false);
    });

    it("search kudos by receiver with pagination", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });

      const firstLimit = totalKudos - 2;
      const response1 = await kudosClient.searchKudosByUser(receiverUsername, { limit: firstLimit });
      const response2 = await kudosClient.searchKudosByUser(receiverUsername, { limit: 1, nextToken: response1.nextToken });
      const response3 = await kudosClient.searchKudosByUser(receiverUsername, { limit: 1, nextToken: response2.nextToken });
      const response4 = await kudosClient.searchKudosByUser(receiverUsername, { limit: 1, nextToken: response3.nextToken });

      expect(response1.items.length).toEqual(firstLimit);
      expect(response1.nextToken).not.toBeNull();
      expect(response2.items.length).toEqual(1);
      expect(response2.nextToken).not.toBeNull();
      expect(response2.items[0]?.message).not.toEqual(response1.items[0]?.message);
      expect(response3.items.length).toEqual(1);
      expect(response3.items[0]?.message).not.toEqual(response1.items[0]?.message);
      expect(response3.items[0]?.message).not.toEqual(response2.items[0]?.message);
      expect(response4.items.length).toEqual(0);
      expect(response4.nextToken).toBeNull();
    });

    it("search kudos by giver with pagination", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });

      const firstLimit = totalKudos - 2;
      const response1 = await kudosClient.searchKudosByUser(giverUsername, { limit: firstLimit });
      const response2 = await kudosClient.searchKudosByUser(giverUsername, { limit: 1, nextToken: response1.nextToken });
      const response3 = await kudosClient.searchKudosByUser(giverUsername, { limit: 1, nextToken: response2.nextToken });
      const response4 = await kudosClient.searchKudosByUser(giverUsername, { limit: 1, nextToken: response3.nextToken });

      expect(response1.items.length).toEqual(firstLimit);
      expect(response1.nextToken).not.toBeNull();
      expect(response2.items.length).toEqual(1);
      expect(response2.nextToken).not.toBeNull();
      expect(response2.items[0]?.message).not.toEqual(response1.items[0]?.message);
      expect(response3.items.length).toEqual(1);
      expect(response3.items[0]?.message).not.toEqual(response1.items[0]?.message);
      expect(response3.items[0]?.message).not.toEqual(response2.items[0]?.message);
      expect(response4.items.length).toEqual(0);
      expect(response4.nextToken).toBeNull();
    });

    it("search kudos by giver with pagination and data source", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const response1 = await kudosClient.searchKudosByUser(giverUsername, { limit: totalKudos, dataSource: DataSourceApp.github });
      expect(response1.items.length).toBe(1);
    });

    it("search kudos by username different casing works", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const connection = await kudosClient.searchKudosByUser(receiverUsername.toLowerCase());
      expect(connection.items.length).toBe(totalKudos);
    });
  });
});
