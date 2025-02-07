import { Tool } from "langchain/tools";
import AgentKit from "../../lib/agentClass";
import { getTokenDataByTicker } from "../functions/dexscreener";

export class TokenByTickerAgents extends Tool {
    name = "solana_by_token_ticker";
    description = ` 
    Get detailed and latest information about any Toke using their token ticker or name

    If the question is about a token ticker then you such as kindly help me check this token "SEND", "Bonk" or whatever 
       
    Inputs ( input is a JSON string ):
        ticker: string ( required |this is the ticker)
    `;

    constructor(private kit: AgentKit) {
        super();
    }

    // private validateInput(input: string): void {
    //     if (typeof input !== "string" || input.trim().length === 0) {
    //         throw new Error("Input must be a non-empty string question");
    //     }
    // }

    protected async _call(input: string): Promise<string> {
        try {
            // this.validateInput(input);
            const { ticker } = JSON.parse(input);
            const result = await getTokenDataByTicker(ticker)

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
