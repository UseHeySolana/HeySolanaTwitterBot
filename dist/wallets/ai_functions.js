"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiTransfer = void 0;
const db_1 = require("../db");
const gemini_1 = require("../requests/gemini");
const transfers_1 = require("./transfers");
const aiTransfer = (object, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const details = object.details;
    let reciever = "";
    if (details.type == "username") {
        reciever = (yield (0, db_1.fetchUser)(details.reciever)).wallet_address;
    }
    else {
        reciever = details.reciever;
    }
    if (!user) {
        return "Sorry this Sender is not registered with the HeySolana app";
    }
    if (!reciever) {
        return "Sorry this Receiver is not registered with the HeySolana app";
    }
    const userTokens = yield (0, transfers_1.getTokens)(user.wallet_address);
    if (details.token.toLowerCase() == "sol") {
        //check if the balance is sufficient
        if (Number((_a = userTokens.solBalance) === null || _a === void 0 ? void 0 : _a.toFixed(2)) < Number(details.amount)) {
            return "You do not have sufficient SOL to perform this transaction!";
        }
        const transfer = yield (0, transfers_1.transferSol)(user.wallet_address, reciever, details.amount);
        return `https://www.twitbot.useheysolana.com/?tx=${transfer}`;
        // const transferRes = await convertSpeech(
        //   `You have transferred ${details.amount} SOL to ${details.reciever} Successfully`
        // );
        // return transferRes;
    }
    else {
        const tokens = userTokens.tokenAccounts.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.symbol) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === details.token.toLowerCase(); });
        if (tokens.length < 1) {
            const response = yield (0, gemini_1.convertSpeech)(`You do not have ${details.token} in your account!`);
            return response;
        }
        else {
            const balance = tokens[0].balance;
            if (Number(balance === null || balance === void 0 ? void 0 : balance.toFixed(2)) < Number(details.amount)) {
                const response = yield (0, gemini_1.convertSpeech)(`You do not have sufficient ${tokens[0].name} to perform this transaction!`);
                return response;
            }
            //   const transfer = await transferToken(
            //     filtered[0].wallet_address,
            //     tokens[0].mint,
            //     details.amount,
            //     tokens[0].decimals,
            //     connection
            //   );
            const transfer = false;
            if (transfer) {
                const transferRes = yield (0, gemini_1.convertSpeech)(`You have transferred ${details.amount} ${tokens[0].name} to ${details.recipient} Successfully`);
                return transferRes;
            }
            else {
                const transferRes = yield (0, gemini_1.convertSpeech)(`Sorry, I couldn't perform the transfer as ${details.token} is not supported yet . Please try again.`);
                return transferRes;
            }
        }
    }
});
exports.aiTransfer = aiTransfer;
