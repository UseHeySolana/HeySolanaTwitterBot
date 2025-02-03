import { SolanaAgentKit } from "../../index";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

/**
 * Get detailed and latest information about any topic using Perplexity AI.
 * @param agent SolanaAgentKit instance
 * @param prompt Text description of the topic to get information about
 * @returns Object containing the generated information
 */
export async function get_info(agent: SolanaAgentKit, prompt: string) {
  try {
    if (!agent.config.OPENAI_API_KEY) {
      throw new Error("Perplexity API key not found in agent configuration");
    }

    const perplexity = new OpenAI({
      apiKey: agent.config.OPENAI_API_KEY,
      // baseURL: "https://api.perplexity.ai",
    });

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are an artificial intelligence assistant and you need to " +
          "engage in a helpful, detailed, polite conversation with a user.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await perplexity.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error(error);
    throw new Error(`Perplexity failed: ${error.message}`);
  }
}
