import OpenAI from "openai";
import * as fs from "fs";
import * as file from "fs/promises";
import * as path from "path";
import * as os from "os";
import { prompA } from "../lib/prompt";

const openAiTwitter = async (text: any) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: prompA,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });
  const jsonMatch =
    completion?.choices[0]?.message?.content?.match(/\{[\s\S]*\}/) || null;

  if (isJson(jsonMatch)) {
    if (jsonMatch === null)
      return (
        completion?.choices[0]?.message?.content ||
        "Sorry, I couldn't process your request. Please try again."
      );
    try {
      const object = JSON.parse(jsonMatch[0]);

      let actiontext =
        object.action == "end-stream"
          ? "Please wait, while I end the conversation"
          : object.action == "transfer"
          ? `Please wait while I check for the user ${object.details.recipient}.`
          : object.action == "check-balance"
          ? "Please wait, while I check your balance"
          : "Please Wait! while I complete your request";
      let actionPlayBack = await convertSpeech(actiontext);
      await delay(500);
      const starter = await playText(audioClass, actionPlayBack, false);
      await delay(500);

      if (!starter) {
        return "Sorry, I couldn't carry out the transaction.";
      }
      switch (object.action) {
        case "end-stream":
          await delay(1000);
          audioClass.stopListening();
          location.reload();
          break;
        case "transfer":
          const response = await aiTransfer(audioClass, object);
          return response;
        case "check-balance": {
          const keypair = await getKeyPair();
          if (!keypair) {
            return "Sorry, I couldn't get your balance. Please try again.";
          }
          const response = await aiCheckBalance(keypair, userDetails, object);
          return response;
        }
        case "swap":
          const token = object.details.token;
          return "Sorry, I couldn't process your swap. Please try again.";

        default:
          return "Unrecognized action.";
      }
    } catch (error) {
      console.error("Error handling JSON or action:", error);
      return "An error occurred while processing your request.";
    }
  }

  return (
    completion?.choices[0]?.message?.content ||
    "Sorry, I couldn't process your request. Please try again."
  );
};

const isJson = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export { openAiTwitter };