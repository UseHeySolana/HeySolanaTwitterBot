import { Request, Response } from "express";
import { checkLogin, getMentionTweets, saveMentionsOnDB } from "./tweet";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

/**
 * Functions to be done
 * 1. Scrape Tweet To Get Mentions
 * 2. Respond to Mentions by Quoting
 * 3.
 */
app.get(
  "/check-for-mentions",
  checkLogin(),
  async (req: any, res: Response) => {
    const { tag } = req.body;

    try {
      // Get Tweets
      const tweets = await getMentionTweets(tag);
      // Save tweets sequentially
      for (const tweet of tweets) {
        await saveMentionsOnDB(tweet); // Ensuring sequential execution
      }

      return res.json({ message: "Tweets Scraped and Saved" });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "Failed: " + e.message });
    }
  }
);

app.get("/api/tts", async (req: any, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text uploaded" });
    }
    const response = "";
    if (response) {
      return res.status(200).json({ status: "success", text: response });
    }
  } catch (e: any) {
    console.error(e);
    res.json({ error: "Failed" + e });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
