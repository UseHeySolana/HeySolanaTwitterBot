"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_KEY = void 0;
const db_1 = require("./db");
const openai_1 = require("./requests/openai");
const index_1 = __importDefault(require("./tweet/index"));
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
exports.API_KEY = process.env.HELIUS_API;
const USER_NAME = process.env.USER_NAME || "";
const PASSWORD = process.env.PASSWORD || "";
const twit = new index_1.default(USER_NAME, PASSWORD);
/**
 * Functions to be done
 * 1. Scrape Tweet To Get Mentions
 * 2. Respond to Mentions by Quoting
 * 3.
 */
app.get("/check-for-mentions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tag } = req.body;
    try {
        const set = yield twit.setCookies();
        if (!set) {
            yield twit.login();
        }
        // Get Tweets
        const tweets = yield twit.getMentionTweets(tag);
        // Save tweets sequentially
        for (const tweet of tweets) {
            yield twit.saveMentionsOnDB(tweet); // Ensuring sequential execution
        }
        return res.json({ message: "Tweets Scraped and Saved" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed: " + e.message });
    }
}));
app.get("/process-mentions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get Tweets
        const tweets = yield (0, db_1.fetchTweets)();
        for (const tweet of tweets) {
            //Process the Tweets in the DB with AI and send Response
            let user = yield (0, db_1.fetchUser)(tweet.createdby);
            if (!user) {
                res.status(500).json({ error: "Failed: No user found " });
            }
            else {
                const response = yield (0, openai_1.openAiTwitter)(tweet.text, user);
                //Update the DB with the response
                const sendDm = yield twit.respondToMentionDM(tweet.tweetid, response, tweet.createdby);
                console.log(sendDm);
                // const updated = await markResponse(tweet.tweetid);
                // if(updated){
                // }
                //Save the information in the DB
            }
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed: " + e.message });
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
