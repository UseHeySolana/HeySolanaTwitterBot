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
exports.openAiTwitter = void 0;
const openai_1 = __importDefault(require("openai"));
const prompt_1 = require("../lib/prompt");
const ai_functions_1 = require("../wallets/ai_functions");
const transfers_1 = require("../wallets/transfers");
const tools_1 = __importDefault(require("../tools"));
const openAiTwitter = (text, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const agent = new tools_1.default();
    const userDetails = yield (0, transfers_1.getTokens)(user.wallet_address);
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const updatedPrompt = prompt_1.prompA +
        "" +
        `this is the list of tokens in the user wallet ${JSON.stringify(userDetails.tokenAccounts, null, 2)} ` +
        `this is the user details ${"Total Balance : " +
            userDetails.balance +
            ", Total Balance in USD/Dollars:" +
            userDetails.totalUsdBalance +
            ", Sol " +
            userDetails.solBalance}`;
    const completion = yield openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
            {
                role: "system",
                content: updatedPrompt,
            },
            {
                role: "user",
                content: text,
            },
        ],
    });
    console.log((_b = (_a = completion === null || completion === void 0 ? void 0 : completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content);
    const jsonMatch = ((_e = (_d = (_c = completion === null || completion === void 0 ? void 0 : completion.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.match(/\{[\s\S]*\}/)) || null;
    if (isJson(jsonMatch)) {
        if (jsonMatch === null)
            return (((_g = (_f = completion === null || completion === void 0 ? void 0 : completion.choices[0]) === null || _f === void 0 ? void 0 : _f.message) === null || _g === void 0 ? void 0 : _g.content) ||
                "Sorry, I couldn't process your request. Please try again.");
        try {
            const object = JSON.parse(jsonMatch[0]);
            switch (object.action) {
                case "transfer":
                    const response = yield (0, ai_functions_1.aiTransfer)(object, user);
                    return response;
                case "rugcheck":
                    const details = object.details;
                    const dets = details.type == "minimal"
                        ? yield agent.rugCheckMinimal(details.mint, text)
                        : yield agent.rugCheckDetailed(details.mint, text);
                    return dets;
                case "swap":
                    const token = object.details.token;
                    return "Sorry, I couldn't process your swap. Please try again.";
                default:
                    return "Unrecognized action.";
            }
        }
        catch (error) {
            console.error("Error handling JSON or action:", error);
            return "An error occurred while processing your request.";
        }
    }
    return (((_j = (_h = completion === null || completion === void 0 ? void 0 : completion.choices[0]) === null || _h === void 0 ? void 0 : _h.message) === null || _j === void 0 ? void 0 : _j.content) ||
        "Sorry, I couldn't process your request. Please try again.");
});
exports.openAiTwitter = openAiTwitter;
const isJson = (str) => {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
};
