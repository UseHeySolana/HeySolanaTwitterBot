import { Scraper, SearchMode } from "agent-twitter-client";
import { addTweet, markResponse } from "../db";
const scraper = new Scraper();

const login = async (username: string, password: string) => {
  const status = await scraper.login(username, password);
  console.log(status);
};

const checkLogin = async () => {
  const status = await scraper.isLoggedIn();
  return status;
};
const getMentionTweets = async (tag: string) => {
  const results = await scraper.fetchSearchTweets(tag, 100, SearchMode.Latest);

  const response = results.tweets
    .filter((tweet) =>
      tweet.mentions.some((mention) => mention.username === tag)
    )
    .map((tweet) => ({
      text: tweet.text as string,
      user_id: tweet.userId as string,
      tweetId: tweet.id as string,
    }));

  return response;
};

const saveMentionsOnDB = async (tweets: {
  text: string;
  user_id: string;
  tweetId: string;
}) => {
  const save = await addTweet(tweets.tweetId, tweets.user_id, tweets.text);
  return save;
};

const respondToMentionsQuote = async (tweetId: string, message: string) => {
  //Repons

  // After Responding
  const response = await markResponse(tweetId);
  return response;
};

const respondToMentionDM = async (
  tweetId: string,
  message: string,
  userId: string
) => {
  const response = await markResponse(tweetId);
  return response;
};

const checkDms = async () => {};

const respondToDMs = async () => {};

export {
  login,
  checkLogin,
  getMentionTweets,
  saveMentionsOnDB,
  respondToMentionsQuote,
  checkDms,
  respondToDMs,
};
