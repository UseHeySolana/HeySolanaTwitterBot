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
exports.interpret = exports.convertSpeech = void 0;
const generative_ai_1 = require("@google/generative-ai");
const openai_1 = __importDefault(require("openai"));
const genAI = new generative_ai_1.GoogleGenerativeAI("");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const convertSpeech = (sentence) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model.generateContent([
        `"${sentence} "Can you rewrite this sentence in a more conversational tone, I want to use it for a text to speech api, make it friendly
          
          Don't return any extra text just the re construct the sentence in a more conversational tone.
          `,
    ]);
    return result.response.text();
});
exports.convertSpeech = convertSpeech;
const interpret = (sentence, question) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(sentence);
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = yield openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
            {
                role: "system",
                content: `""Interprete this response to a meaniful and more sensible sentence, based on what the user asked, this is the users question ${question}.
        `,
            },
            {
                role: "user",
                content: ` ${sentence}`,
            },
        ],
    });
    return (_b = (_a = completion === null || completion === void 0 ? void 0 : completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
});
exports.interpret = interpret;
