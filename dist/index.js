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
exports.BASE_URL = exports.API_KEY = void 0;
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
exports.BASE_URL = process.env.ENVIRONMENT == "dev"
    ? "http://127.0.0.1:8000/api"
    : "https://api.yraytestings.com.ng/api";
const USER_NAME = process.env.USER_NAME || "";
const PASSWORD = process.env.PASSWORD || "";
const twit = new index_1.default(USER_NAME, PASSWORD);
/**
 * Functions to be done
 * 1. Scrape Tweet To Get Mentions
 * 2. Respond to Mentions by Quoting
 * 3.
 */
app.post("/check-for-mentions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tag } = req.body;
    try {
        const set = yield twit.setCookies();
        if (!set) {
            yield twit.login();
        }
        // Get Tweets
        const tweets = yield twit.getMentionTweets(tag);
        console.log(tweets);
        if (tweets.length > 0) {
            // Save tweets sequentially
            for (const tweet of tweets) {
                yield twit.saveMentionsOnDB(tweet); // Ensuring sequential execution
            }
            return res.json({ message: "Tweets Scraped and Saved" });
        }
        else {
            return res.json({ message: "Not Tweets Found!!" });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed: " + e.message });
    }
}));
app.get("/get-dms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get Tweets
        const dms = yield twit.checkDms("885980641992601601");
        // Save tweets sequentially
        return res.json({ message: "Dms Gotten" });
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
                res.status(200).json({ error: "Failed: No user found " });
            }
            else {
                const response = yield (0, openai_1.openAiTwitter)(tweet.text, user);
                //Update the DB with the response
                const sendDm = yield twit.respondToMentionDM(tweet.tweetid, response, tweet.createdby);
                if (sendDm) {
                    return res.json({ message: "Tweets Processed and Responded" });
                }
                else {
                    return res.json({ message: "Tweets Processed and Responded" });
                }
            }
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed: " + e.message });
    }
}));
app.post("/test-bot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    const user = {
        wallet_address: "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ",
    };
    const response = yield (0, openai_1.openAiTwitter)(text, user);
    res.status(200).json({ message: response });
}));
app.post("/fetch-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    if (!username)
        return res.status(400).json({ "message": "No username added!" });
    const userId = yield twit.getUser(username);
    res.status(200).json({ "userId": userId });
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
