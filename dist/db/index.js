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
exports.fetchTweets = exports.fetchCookie = exports.saveCookie = exports.fetchUser = exports.markResponse = exports.addTweet = void 0;
const __1 = require("..");
const request = {
    get: (url) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(__1.BASE_URL + url, {
            method: "GET",
        });
        return response;
    }),
    post: (data, url) => __awaiter(void 0, void 0, void 0, function* () {
        // Upload to your API endpoint
        const response = yield fetch(__1.BASE_URL + url, {
            method: "POST",
            body: data,
        });
        return response;
    }),
};
const fetchUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield request.get(`/fetch_user/${userId}`);
        // const docRef = doc(db, "message", userId);
        if (response) {
            const data = yield response.json();
            return data;
        }
        else {
            console.log("No Such User!");
            return false;
        }
    }
    catch (e) {
        console.error("Error fetching Data", e);
        return false;
    }
});
exports.fetchUser = fetchUser;
const addTweet = (tweetId, userId, tweet) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = new FormData();
        formData.append("tweet_id", tweetId);
        formData.append("tweet", tweet);
        formData.append("user_id", userId);
        const response = yield request.post(formData, "/add_tweet");
        const data = yield response.json();
        return true;
    }
    catch (error) {
        console.log("Error adding document ", error);
        return false;
    }
});
exports.addTweet = addTweet;
const markResponse = (tweetId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield request.get(`/mark_response/${tweetId}`);
        const result = yield response.json();
        return result;
    }
    catch (error) {
        console.error("Error fetching data: ", error);
        return [];
    }
});
exports.markResponse = markResponse;
const saveCookie = (cookie) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = new FormData();
        formData.append("cookie", cookie);
        const response = yield request.post(formData, "/add_cookie");
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.log("Error adding document ", error);
        return false;
    }
});
exports.saveCookie = saveCookie;
const fetchCookie = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield request.get(`/fetch_cookie`);
        const data = yield response.json();
        return data.cookie;
    }
    catch (error) {
        console.error("Error fetching data: ", error);
        return false;
    }
});
exports.fetchCookie = fetchCookie;
const fetchTweets = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield request.get(`/fetch_tweets`);
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching data: ", error);
        return false;
    }
});
exports.fetchTweets = fetchTweets;
