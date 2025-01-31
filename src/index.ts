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

export const API_KEY = process.env.HELIUS_API;
export const BASE_URL =
  process.env.ENVIRONMENT == "dev"
    ? "http://127.0.0.1:8000/api"
    : "https://api.yraytestings.com.ng/api";
const USER_NAME = process.env.USER_NAME || "";
const PASSWORD = process.env.PASSWORD || "";

const twit = new TwitterBot(USER_NAME, PASSWORD);
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
    console.log(tweets);
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

    for (const tweet of tweets as any) {
      //Process the Tweets in the DB with AI and send Response
      let user = await fetchUser(tweet.createdby);
      if (!user) {
        res.status(200).json({ error: "Failed: No user found " });
      } else {
        const response = await openAiTwitter(tweet.text, user);
        //Update the DB with the response
        const sendDm = await twit.respondToMentionDM(
          tweet.tweetid,
          response,
          tweet.createdby
        );
        if (sendDm) {
          return res.json({ message: "Tweets Processed and Responded" });
        } else {
          return res.json({ message: "Tweets Processed and Responded" });
        }
      }
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Failed: " + e.message });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
