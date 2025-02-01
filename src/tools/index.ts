import { fetchTokenDetailedReport, fetchTokenReportSummary } from "./specific-tools";

class AgentTools {


    constructor() {
        // this.scraper = new Scraper();
    }

    async rugCheckMinimal(mint: string): Promise<any> {
        const response = await fetchTokenReportSummary(mint)
        return response;
    }
    async rugCheckDetailed(mint: string): Promise<any> {
        const response = await fetchTokenDetailedReport(mint)
        return response;
    }

}

export default AgentTools;
