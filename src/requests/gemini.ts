import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GA_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const convertSpeech = async (sentence: any) => {
  const result = await model.generateContent([
    `"${sentence} "Can you rewrite this sentence in a more conversational tone, I want to use it for a text to speech api, make it friendly
          
          Don't return any extra text just the re construct the sentence in a more conversational tone.
          `,
  ]);
  return result.response.text();
};

export { convertSpeech };
