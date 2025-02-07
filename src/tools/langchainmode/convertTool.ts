import { Tool } from "langchain/tools";
import { getAgentByCA, getAgentByUsername } from "../functions/cookie";
import AgentKit from "../../lib/agentClass";

export class SearchAgents extends Tool {
    name = "solana_search_agent_by_username_or_ca";
    description =
        `Get detailed and latest information about any agent using their username or ca. 
 
    if the question is asking about AI agents, and they send CA or Agent Name 
    Inputs (is a json string )
            {
               "type": "CA | AgentName" string,
               "ca": "CA1234567890" || null(when it is agent name),
               "name": "AgentName" || null(when it is CA),
             }
    
    `;

    constructor(private kit: AgentKit) {
        super();
    }

    private validateInput(input: string): void {
        if (typeof input !== "string" || input.trim().length === 0) {
            throw new Error("Input must be a non-empty string question");
        }
    }

    protected async _call(input: string): Promise<string> {
        try {
            this.validateInput(input);
            const parsedInput = JSON.parse(input);
            const result = parsedInput.type === "CA" ? await getAgentByCA(parsedInput.ca) : await getAgentByUsername(parsedInput.name);

            return JSON.stringify({
                status: "success",
                message: "Information retrieved successfully",
                content: result,
            });
        } catch (error: any) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
