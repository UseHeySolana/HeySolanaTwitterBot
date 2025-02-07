import { Request, Response } from "express";
import { fetchTweets, fetchUser } from "./db";
import { openAiTwitter } from "./requests/openai";
import TwitterBot from "./tweet/index";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const env = process.env.ENVIRONMENT;
export const COOKIE_BASE = "https://api.cookie.fun/v2/agents";
export const API_KEY = process.env.HELIUS_API;
export const COOKIE_KEY = process.env.COOKIE_API || "";
export const BASE_URL =
  env == "dev"
    ? "http://127.0.0.1:8000/api"
    : "https://api.yraytestings.com.ng/api";
const USER_NAME = process.env.USER_NAME || "";
const PASSWORD = process.env.PASSWORD || "";

const api_secret_key = process.env.TWITTER_API_SECRET_KEY || "";
const api_secret = process.env.TWITTER_API_SECRET || "";

const access_token = process.env.TWITTER_ACCESS_TOKEN || "";
const access_secret = process.env.TWITTER_ACCESS_SECRET || "";

const twit = new TwitterBot(USER_NAME, PASSWORD, api_secret_key, api_secret, access_secret, access_token);
/**
 * Functions to be done
 * 1. Scrape Tweet To Get Mentions
 * 2. Respond to Mentions by Quoting
 * 3.
 */
app.post("/check-for-mentions", async (req: any, res: Response) => {
  const { tag } = req.body;

  try {
    const set = await twit.setCookies();
    if (!set) {
      await twit.login();
    }
    // Get Tweets
    const tweets = await twit.getMentionTweets(tag);
    if (tweets.length > 0) {
      // Save tweets sequentially
      for (const tweet of tweets) {
        await twit.saveMentionsOnDB(tweet); // Ensuring sequential execution
      }
      return res.json({ message: "Tweets Scraped and Saved" });
    } else {
      return res.json({ message: "Not Tweets Found!!" });
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Failed: " + e.message });
  }
});

app.get("/get-dms", async (req: any, res: Response) => {
  try {
    // Get Tweets
    const dms = await twit.checkDms("885980641992601601");
    // Save tweets sequentially
    return res.json({ message: "Dms Gotten" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Failed: " + e.message });
  }
});

app.get("/process-mentions", async (req: any, res: Response) => {
  try {
    //Get Tweets
    const tweets = await fetchTweets();
    const responses = [];

    if (tweets.length > 0) {
      for (const tweet of tweets) {
        let user = await fetchUser(tweet.createdby);
        console.log(user);

        if (!user) {
          const sendDm = await twit.respondToMentionsQuote(
            tweet.tweetid,
            "Hey there! To use AgentX, kindly register here: https://agentx.useheysolana.xyz/ and follow @useHeySolana."
          );
          if (sendDm) {
          responses.push({ tweetId: tweet.tweetid, message: "Responded with no user info" });
          } else {
            responses.push({ tweetId: tweet.tweetid, message: "Tweet was not sent" });
          }
        } else {
          const response = await openAiTwitter(tweet.text, user);
          const sendDm = await twit.respondToMentionDM(tweet.tweetid, response);
          responses.push({ tweetId: tweet.tweetid, message: "Tweet processed and responded" });
        }
      }

      res.json({ message: "All tweets processed", results: responses });
      // for (const tweet of tweets as any) {              
      // //Process the Tweets in the DB with AI and send Response
      // let user = await fetchUser(tweet.createdby);
      //   console.log(user);
      // if (!user) {
      //   //Update the DB with the response
      //   const sendDm = await twit.respondToMentionsQuote(
      //     tweet.tweetid,
      //     "Hey there! to be able to use AgentX kindly register on this link https://agentx.useheysolana.xyz/ and follow our mother page @useHeySolana",
      //   );
      //   console.log(sendDm)
      //   // if (sendDm) {
      //   //   return res.json({ message: "Tweets Processed and Responded with no user info" });
      //   // } else {
      //   return res.json({ message: "Tweets Processed and Responded with no user info" });
      //   // }
      // } else {
      //   const response = await openAiTwitter(tweet.text, user);
      //   //Update the DB with the response
      //   const sendDm = await twit.respondToMentionDM(
      //     tweet.tweetid,
      //     response,
      //   );
      //   if (sendDm) {
      //     return res.json({ message: "Tweets Processed and Responded" });
      //   } else {
      //     return res.json({ message: "Tweets Processed and Responded" });
      //   }
      // }
      // }
    } else {
      return res.json({ message: "No tweets to process" });
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Failed: " + e.message });
  }
});

app.post("/test-bot", async (req: any, res: Response) => {
  const { text } = req.body;

  const user = {
    wallet_address: "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ",
  };
  const response = await openAiTwitter(text, user);
  res.status(200).json({ message: response });
});

app.post("/fetch-user", async (req: any, res: Response) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ "message": "No username added!" })
  const userId = await twit.getUser(username);
  res.status(200).json({ "userId": userId });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
