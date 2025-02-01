import OpenAI from "openai";
import { prompA } from "../lib/prompt";
import { aiTransfer } from "../wallets/ai_functions";
import { getTokens } from "../wallets/transfers";
import AgentTools from "../tools";

const openAiTwitter = async (text: any, user: any) => {
  const agent = new AgentTools()
  const userDetails = await getTokens(user.wallet_address);
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const updatedPrompt =
    prompA +
    "" +
    `this is the list of tokens in the user wallet ${JSON.stringify(
      userDetails.tokenAccounts,
      null,
      2
    )} ` +
    `this is the user details ${
      "Total Balance : " +
      userDetails.balance +
      ", Total Balance in USD/Dollars:" +
      userDetails.totalUsdBalance +
      ", Sol " +
      userDetails.solBalance
    }`;
  const completion = await openai.chat.completions.create({
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
  console.log(completion?.choices[0]?.message?.content);
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
      switch (object.action) {
        case "transfer":
          const response = await aiTransfer(object, user);
          return response;
        case "rugcheck":
          const details = object.details;
          const dets = details.type == "minimal" ? await agent.rugCheckMinimal(details.mint) : await agent.rugCheckDetailed(details.mint)
          return dets;
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
