import { getAgentByCA, getAgentByUsername } from "./functions/cookie";
import { interpret } from "../requests/gemini";
import {
  fetchTokenDetailedReport,
  fetchTokenReportSummary,
} from "./functions/rugcheck";
import { getTokenDataByTicker } from "./functions/dexscreener";
import { PublicKey } from "@solana/web3.js";
import { fetchPrice, stakeWithJup, trade } from "./functions/jupiter";

class AgentTools {
  constructor() {
    // this.scraper = new Scraper();
  }
  async convert(response: string, question?: string) {
    const res = await interpret(JSON.stringify(response), question || "");
    return res;
  }

  async getUsername(username: string, question?: string): Promise<any> {
    const response = await getAgentByUsername(username);
    const res = await this.convert(JSON.stringify(response), question);
    return res;
  }

  async getCA(ca: string, question?: string): Promise<any> {
    const response = await getAgentByCA(ca);
    const res = await this.convert(JSON.stringify(response), question);
    return res;
  }

  async rugCheckMinimal(mint: string, question: string): Promise<any> {
    const response = await fetchTokenReportSummary(mint);
    const res = await this.convert(JSON.stringify(response), question);
    return res;
  }
  async rugCheckDetailed(mint: string, question: string): Promise<any> {
    const response = await fetchTokenDetailedReport(mint);
    const res = await this.convert(JSON.stringify(response), question);
    return res;
  }

  async fetchTokenByTicker(ticker: string, question: string): Promise<any> {
    const response = await getTokenDataByTicker(ticker);
    const res = await this.convert(JSON.stringify(response), question);
    return res;
  }

  async swapTokens(wallet_address: PublicKey, outputMint: PublicKey, inputMint: PublicKey, inputAmount: number, question: string): Promise<any> {
    const swap = await trade(wallet_address, inputMint, inputAmount, outputMint)
    return swap;
  }

  async stakeTokens(wallet_address: PublicKey, amount: number, question: string): Promise<any> {
    const stake = await stakeWithJup(wallet_address, amount);
    return stake;
  }

  async jupfetchPrice(tokenId: string, question: string): Promise<any> {
    const response = await fetchPrice(new PublicKey(tokenId));
    console.log(response);
    return response;
  }
}

export default AgentTools;