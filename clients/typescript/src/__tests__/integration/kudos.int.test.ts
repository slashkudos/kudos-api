/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const { kudo, receiver } = await kudosClient.createTwitterKudo({
      giverUsername,
      receiverUsername,
      message: message,
      tweetId: tweetId,
      giverProfileImageUrl,
      receiverProfileImageUrl,
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
        await kudosClient.createTwitterKudo({
          giverUsername,
          receiverUsername,
          message: "testMessage",
          tweetId: "testTweetId",
          giverProfileImageUrl,
          receiverProfileImageUrl,
        })
    ).rejects.toThrow();
  });

  describe("after kudos are created", () => {
    it("lists kudos with no filters", async () => {
      const kudosClient = await KudosApiClient.build({ ApiKey: apiKey, ApiUrl: apiUrl });
      const kudos = await kudosClient.listKudos({});
      expect(kudos).not.toBeNull();
      expect(kudos.items.length).toBeGreaterThanOrEqual(1);
    });
  });
});
