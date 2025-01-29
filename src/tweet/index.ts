import { Scraper, SearchMode } from "agent-twitter-client";
import { addTweet, fetchCookie, markResponse, saveCookie } from "../db";

class TwitterBot {
  private scraper: Scraper;
  // private username: string;
  // private password: string;

  constructor(private username: string, private password: string) {
    this.scraper = new Scraper();
  }

  private formatCookies(cookieInput: string[]): string {
    const jsonArray = cookieInput.map((cookie) =>
      `${cookie}`.replace("Cookies:=", "")
    );
    return JSON.stringify(jsonArray);
  }

  async login(): Promise<void> {
    await this.scraper.login(this.username, this.password);
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
          (mention) => mention.username?.toLowerCase() === tag.toLowerCase()
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
    await markResponse(tweetId);
    return true;
  }

  async respondToMentionDM(
    tweetId: string,
    message: string,
    userId: string
  ): Promise<boolean> {
    try {
      await this.scraper.sendTweet(message, tweetId);
      await markResponse(tweetId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async checkDms(): Promise<void> {
    // Implementation for checking DMs
  }

  async respondToDMs(): Promise<void> {
    // Implementation for responding to DMs
  }
}

export default TwitterBot;
