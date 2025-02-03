import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { createSolanaTools, SolanaAgentKit } from "../solanaagentkit";

class AgentKit {

    private solanaAgentKit: SolanaAgentKit
    constructor(private api_key: string, rpc_url: string, wallet_address: string) {
        this.solanaAgentKit = new SolanaAgentKit(wallet_address, rpc_url, { OPENAI_API_KEY: api_key })

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
        const tools = createSolanaTools(this.solanaAgentKit)

        // Get agent prompt from LangChain hub
        // Create a properly typed prompt template
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a helpful AI assistant that uses tools to accomplish tasks."],
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
