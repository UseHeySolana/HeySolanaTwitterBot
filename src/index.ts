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
const USER_NAME = process.env.USER_NAME || "";
const PASSWORD = process.env.PASSWORD || "";

const twit = new TwitterBot(USER_NAME, PASSWORD);
/**
 * Functions to be done
 * 1. Scrape Tweet To Get Mentions
 * 2. Respond to Mentions by Quoting
 * 3.
 */
app.get("/check-for-mentions", async (req: any, res: Response) => {
  const { tag } = req.body;

  try {
    const set = await twit.setCookies();
    if (!set) {
      await twit.login();
    }
    // Get Tweets
    const tweets = await twit.getMentionTweets(tag);
    // Save tweets sequentially
    for (const tweet of tweets) {
      await twit.saveMentionsOnDB(tweet); // Ensuring sequential execution
    }
    return res.json({ message: "Tweets Scraped and Saved" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Failed: " + e.message });
  }
});

app.get("/process-mentions", async (req: any, res: Response) => {
  try {
    //Get Tweets

    const tweets = await fetchTweets();

    for (const tweet of tweets) {
      //Process the Tweets in the DB with AI and send Response
      let user = await fetchUser(tweet.createdby);
      if (!user) {
        res.status(500).json({ error: "Failed: No user found " });
      } else {
        const response = await openAiTwitter(tweet.text, user);
        //Update the DB with the response

        const sendDm = await twit.respondToMentionDM(
          tweet.tweetid,
          response,
          tweet.createdby
        );

        console.log(sendDm);
        // const updated = await markResponse(tweet.tweetid);
        // if(updated){

        // }
        //Save the information in the DB
      }
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Failed: " + e.message });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
