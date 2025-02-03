import tokenBalancesAction from "./tokenBalances";
import balanceAction from "./solana/balance";
import transferAction from "./solana/transfer";
import requestFundsAction from "./solana/requestFunds";
import getTPSAction from "./solana/getTPS";
import createImageAction from "./agent/createImage";
import getInfoAction from "./agent/get_info";

export const ACTIONS = {
  GET_INFO_ACTION: getInfoAction,
  TOKEN_BALANCES_ACTION: tokenBalancesAction,
  BALANCE_ACTION: balanceAction,
  TRANSFER_ACTION: transferAction,
  REQUEST_FUNDS_ACTION: requestFundsAction,
  GET_TPS_ACTION: getTPSAction,
  CREATE_IMAGE_ACTION: createImageAction,

};

export type { Action, ActionExample, Handler } from "../types/action";
