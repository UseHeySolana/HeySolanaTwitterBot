import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const genAI = new GoogleGenerativeAI("");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const convertSpeech = async (sentence: any) => {
  const result = await model.generateContent([
    `"${sentence} "Can you rewrite this sentence in a more conversational tone, I want to use it for a text to speech api, make it friendly
          
          Don't return any extra text just the re construct the sentence in a more conversational tone.
          `,
  ]);
  return result.response.text();
};

const interpret = async (sentence: any, question: string) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `""Interprete this response to a meaniful and more sensible sentence, based on what the user asked, this is the users question ${question}.

        Your answer should be brief and correctly answer the question
        `,
      },
      {
        role: "user",
        content: ` ${sentence}`,
      },
    ],
  });
  return completion?.choices[0]?.message?.content;
};

export { convertSpeech, interpret };
