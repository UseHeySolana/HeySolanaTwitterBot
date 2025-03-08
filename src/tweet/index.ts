import { Scraper, SearchMode } from "agent-twitter-client";
import { addTweet, fetchCookie, markResponse, saveCookie } from "../db";

class TwitterBot {
  private scraper: Scraper;
  // private username: string;
  // private password: string;

  constructor(private username: string, private password: string,
    private appKey: string,
    private appSecret: string,
    private accessTokenSecret: string,
    private accessToken: string) {
    this.scraper = new Scraper();
  }

  private formatCookies(cookieInput: string[]): string {
    const jsonArray = cookieInput.map((cookie) =>
      `${cookie}`.replace("Cookies:=", "")
    );
    return JSON.stringify(jsonArray);
  }

  async login(): Promise<void> {

    await this.scraper.login(
      this.username,
      this.password,
      undefined,
      this.appKey,
      this.appSecret,
      this.accessToken,
      this.accessTokenSecret
    );
    await this.getCookies();
  }

  async checkLogin(): Promise<boolean> {
    return await this.scraper.isLoggedIn();
  }

  private async getCookies(): Promise<boolean> {
    const cookies = await this.scraper.getCookies();
    //@ts-ignore
    const formattedCookie = this.formatCookies(cookies);
    return await saveCookie(formattedCookie);
  }

  async setCookies(): Promise<boolean> {
    try {
      const db = await fetchCookie();
      if (db) {
        await this.scraper.setCookies(JSON.parse(db));
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getMentionTweets(
    tag: string
  ): Promise<{ text: string; user_id: string; tweetId: string }[]> {
    const results = await this.scraper.fetchSearchTweets(
      tag,
      100,
      SearchMode.Latest
    );

    return results.tweets
      .filter((tweet) =>
        tweet.mentions.some(
          (mention) =>
            mention.username?.toLowerCase() === tag.toLowerCase() &&
            tweet.text?.toLowerCase().includes(tag.toLowerCase())
        )
      )
      .map((tweet) => ({
        text: tweet.text as string,
        user_id: tweet.userId as string,
        tweetId: tweet.id as string,
      }));
  }

  async saveMentionsOnDB(tweets: {
    text: string;
    user_id: string;
    tweetId: string;
  }): Promise<boolean> {
    return await addTweet(tweets.tweetId, tweets.user_id, tweets.text);
  }

  async respondToMentionsQuote(
    tweetId: string,
    message: string
  ): Promise<boolean> {
    try {
      const tweet = await this.scraper.sendQuoteTweet(message, tweetId);

    await markResponse(tweetId);
    return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async respondToMentionDM(
    tweetId: string,
    message: string,
    user: string,
  ): Promise<boolean> {
    try {
      let res = await this.scraper.sendTweet(`@${user}` + " " + message, tweetId);
      if (res) {
      await markResponse(tweetId);
      } else { return false }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async checkDms(userId: string): Promise<void> {
    // Implementation for checking DMs
    try {
      const messages = await this.scraper.getDirectMessageConversations(userId);
      // const messages = await this.scraper.sendDirectMessage(
      // "testing direct dm",
      // ""
      // );

      console.log(messages);
    } catch (e) {
      console.error(e);
    }
  }

  async respondToDMs(message: string, userId: string): Promise<boolean> {
    const sendDm = await this.scraper.sendDirectMessage(message, userId);
    console.log(sendDm);
    return true;
    // Implementation for responding to DMs
  }

  async getUser(username: string): Promise<string | boolean> {
    try {
      const userId = await this.scraper.getProfile(username);
      if (!userId.userId) return false;
      return userId.userId;
    } catch (e: any) {
      console.log(e.message)
      return false
    }
  }
}

export default TwitterBot;
