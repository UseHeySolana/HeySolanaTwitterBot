import { interpret } from "../requests/gemini";
import {
  fetchTokenDetailedReport,
  fetchTokenReportSummary,
} from "./specific-tools";

class AgentTools {
  constructor() {
    // this.scraper = new Scraper();
  }

  async rugCheckMinimal(mint: string, question: string): Promise<any> {
    const response = await fetchTokenReportSummary(mint);
    const convert = await interpret(JSON.stringify(response), question);
    return convert;
  }
  async rugCheckDetailed(mint: string, question: string): Promise<any> {
    const response = await fetchTokenDetailedReport(mint);
    const convert = await interpret(JSON.stringify(response), question);
    return convert;
  }
}

export default AgentTools;