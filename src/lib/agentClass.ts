import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import bs58 from "bs58";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { createAgentTools } from "./toolsAggregator";
import { prompA } from "./prompt";
import { getTokens } from "../wallets/transfers";

export interface AgentParams {
    api_key: string;
    rpc_url: string;
    privatekey: string;
    wallet_address: PublicKey;
    connection: Connection;
    wallet: Keypair;
}

class AgentKit {


    constructor(public tweet: string, public user: any, public api_key: string) {
    }

    // Setup agent with tools
    async setupAgent() {


        // Initialize the model
        const model = new ChatOpenAI({
            openAIApiKey: this.api_key,
            modelName: "gpt-4o",
            temperature: 0,
        });

        // Define tools
        const tools = createAgentTools(this);

        // Get agent prompt from LangChain hub
        // Create a properly typed prompt template
        const prompt = ChatPromptTemplate.fromMessages([
            // ["system", updatedPrompt],
            ["system", "You are a helpful AI assistant that uses tools to accomplish tasks Make your answers brief and accurate. when asked about user info use the information passed"],
            new MessagesPlaceholder("agent_scratchpad"),
            ["human", "{input}"],
        ]);


        // Create the agent
        const agent = await createOpenAIToolsAgent({
            llm: model,
            tools,
            prompt,
        });

        // Create the executor
        const agentExecutor = new AgentExecutor({
            agent,
            tools,
            verbose: true, // Set to true for debugging
        });

        return agentExecutor;
    };

    // Function to run the agent
    async runAgent(executor: AgentExecutor, input: string): Promise<string> {
        try {
            const result = await executor.invoke({
                input,
            });
            return result.output;
        } catch (error) {

            console.error("Agent execution error:", error);
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;

        }
    };

}

export default AgentKit;
