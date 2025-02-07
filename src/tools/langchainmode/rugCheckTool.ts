import { Tool } from "langchain/tools";
import AgentKit from "../../lib/agentClass";
import { fetchTokenDetailedReport, fetchTokenReportSummary } from "../functions/rugcheck";

export class RugCheckAgents extends Tool {
    name = "solana_rugchecker_by_token_mint";
    description =
        `Get detailed and latest information about any token using their mint and ca. 

  if the question is asked about if a token is a rug or details eg:[ kindly help me check this token or CA:"afakfjakfjakfjakf" or "Should I buy this token and what are the potentials sjdkfjkdfjskfjskfjskf ], you can based on your discretion do a detailed check or minimal check about the token 

    Inputs (is a json string )
          {
             "type": "minimal | detailed"
               "mint": "contract address here"
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
            const result = parsedInput.type === "minimal" ? await fetchTokenReportSummary(parsedInput.mint) : await fetchTokenDetailedReport(parsedInput.mint);

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
