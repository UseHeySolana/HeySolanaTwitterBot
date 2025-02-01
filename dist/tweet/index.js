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
Object.defineProperty(exports, "__esModule", { value: true });
const agent_twitter_client_1 = require("agent-twitter-client");
const db_1 = require("../db");
class TwitterBot {
    // private username: string;
    // private password: string;
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.scraper = new agent_twitter_client_1.Scraper();
    }
    formatCookies(cookieInput) {
        const jsonArray = cookieInput.map((cookie) => `${cookie}`.replace("Cookies:=", ""));
        return JSON.stringify(jsonArray);
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.scraper.login(this.username, this.password);
            yield this.getCookies();
        });
    }
    checkLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.scraper.isLoggedIn();
        });
    }
    getCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = yield this.scraper.getCookies();
            //@ts-ignore
            const formattedCookie = this.formatCookies(cookies);
            return yield (0, db_1.saveCookie)(formattedCookie);
        });
    }
    setCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield (0, db_1.fetchCookie)();
                if (db) {
                    yield this.scraper.setCookies(JSON.parse(db));
                    return true;
                }
                return false;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getMentionTweets(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.scraper.fetchSearchTweets(tag, 100, agent_twitter_client_1.SearchMode.Latest);
            return results.tweets
                .filter((tweet) => tweet.mentions.some((mention) => {
                var _a, _b;
                return ((_a = mention.username) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === tag.toLowerCase() &&
                    ((_b = tweet.text) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(tag.toLowerCase()));
            }))
                .map((tweet) => ({
                text: tweet.text,
                user_id: tweet.userId,
                tweetId: tweet.id,
            }));
        });
    }
    saveMentionsOnDB(tweets) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.addTweet)(tweets.tweetId, tweets.user_id, tweets.text);
        });
    }
    respondToMentionsQuote(tweetId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.markResponse)(tweetId);
            return true;
        });
    }
    respondToMentionDM(tweetId, message, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.scraper.sendTweet(message, tweetId);
                yield (0, db_1.markResponse)(tweetId);
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    checkDms(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation for checking DMs
            try {
                const messages = yield this.scraper.getDirectMessageConversations(userId);
                // const messages = await this.scraper.sendDirectMessage(
                // "testing direct dm",
                // ""
                // );
                console.log(messages);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    respondToDMs(message, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendDm = yield this.scraper.sendDirectMessage(message, userId);
            console.log(sendDm);
            return true;
            // Implementation for responding to DMs
        });
    }
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield this.scraper.getProfile(username);
                if (!userId.userId)
                    return false;
                return userId.userId;
            }
            catch (e) {
                console.log(e.message);
                return false;
            }
        });
    }
}
exports.default = TwitterBot;
