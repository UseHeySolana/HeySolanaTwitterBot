import { Tool } from "langchain/tools";
import { getAgentByCA, getAgentByUsername } from "../functions/cookie";
import AgentKit from "../../lib/agentClass";
import { getTokens } from "../../wallets/transfers";

export class AccountAgent extends Tool {
    name = "solana_user_account_tool";
    description =
        `This checks the user account and gets more information about the user

        if the user says "Hey Solana, what's my balance? or intent is to check balance" you are to check the Total Balance in USD/Dollars of the user from the user details added to this prompt.

if the balance is for a specific token you are to check the list of tokens added to this prompt and return the balance of the token for the user. for any reason you do not find or understand what token is being asked ask the user to reiterate.


if the user ask to know which tokens are in his wallet, return a response with the list of tokens in the user wallet.

no input needed
  `;

    constructor(private kit: AgentKit) {
        super();
    }

    protected async _call(): Promise<string> {
        try {
            const userDetails = await getTokens(this.kit.user.wallet_address);

            const updatedPrompt =
                "" +
                `this is the list of tokens in the user wallet ${JSON.stringify(
                    userDetails.tokenAccounts,
                    null,
                    2
                )} ` +
                `this is the user details ${"Total Balance : " +
                userDetails.balance +
                ", Total Balance in USD/Dollars:" +
                userDetails.totalUsdBalance +
                ", Sol " +
                userDetails.solBalance
                }`;


            return JSON.stringify({
                status: "success",
                message: "Information retrieved successfully",
                content: updatedPrompt,
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
