import AgentTools from "../tools";
import { SearchAgents } from "../tools/langchainmode/convertTool";
import { RugCheckAgents } from "../tools/langchainmode/rugCheckTool";
import { TokenByTickerAgents } from "../tools/langchainmode/tokenbyTicker";
import { AccountAgent } from "../tools/langchainmode/userInfoTool";
import AgentKit from "./agentClass";




export function createAgentTools(kit: AgentKit) {
    return [
        new SearchAgents(kit), //Cookie.fun
        new RugCheckAgents(kit), //bootstrapped from SolanaAgentKit
        new TokenByTickerAgents(kit), //bootstrapped from SolanaAgentKit
        new AccountAgent(kit), // personal tool
    ]
}