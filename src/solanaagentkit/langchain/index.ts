
export * from "./dexscreener";
export * from "./solana";
export * from "./agent";
export * from "./rugcheck";

import type { SolanaAgentKit } from "../agent";
import {
  SolanaBalanceTool,
  SolanaBalanceOtherTool,
  SolanaTransferTool,

  SolanaRequestFundsTool,
  SolanaGetWalletAddressTool,

  SolanaCreateImageTool,

  SolanaTPSCalculatorTool,

  SolanaTokenDataByTickerTool,



  SolanaCloseEmptyTokenAccounts,
  SolanaFetchTokenReportSummaryTool,
  SolanaFetchTokenDetailedReportTool,



  SolanaGetInfoTool,

} from "./index";

export function createSolanaTools(solanaKit: SolanaAgentKit) {
  return [
    new SolanaGetInfoTool(solanaKit),//fixed
    new SolanaBalanceTool(solanaKit), //working
    new SolanaBalanceOtherTool(solanaKit), //working
    new SolanaTransferTool(solanaKit),
    new SolanaRequestFundsTool(solanaKit),
    new SolanaGetWalletAddressTool(solanaKit),
    new SolanaCreateImageTool(solanaKit),
    new SolanaTPSCalculatorTool(solanaKit),
    new SolanaTokenDataByTickerTool(solanaKit),  
    new SolanaCloseEmptyTokenAccounts(solanaKit),
    new SolanaFetchTokenReportSummaryTool(solanaKit),
    new SolanaFetchTokenDetailedReportTool(solanaKit),
  ];
}
