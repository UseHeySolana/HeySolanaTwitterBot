import { getAgentByCA, getAgentByUsername } from "./specific-tools/cookie";
import { interpret } from "../requests/gemini";
import {
  fetchTokenDetailedReport,
  fetchTokenReportSummary,
} from "./specific-tools/rugcheck";
import { getTokenDataByTicker } from "./specific-tools/dexscreener";

class AgentTools {
  constructor() {
    // this.scraper = new Scraper();
  }
  async convert(response: string, question: string) {
    const res = await interpret(JSON.stringify(response), question);
    return res;
  }

  async getUsername(username: string, question: string): Promise<any> {
    const response = await getAgentByUsername(username);
    const res = await this.convert(JSON.stringify(response), question);
    return res;
  }

  async getCA(ca: string, question: string): Promise<any> {
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
}

export default AgentTools;