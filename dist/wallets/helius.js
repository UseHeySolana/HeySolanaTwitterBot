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
exports.getBalance = exports.fetchTokenAccounts = exports.fetchTokenDetails = exports.fetchConversionRate = exports.API_KEY = exports.network = void 0;
const web3_js_1 = require("@solana/web3.js");
const __1 = require("..");
Object.defineProperty(exports, "API_KEY", { enumerable: true, get: function () { return __1.API_KEY; } });
// const network = "https://mainnet.helius-rpc.com/?api-key=";
const network = "https://devnet.helius-rpc.com/?api-key=";
exports.network = network;
const fetchConversionRate = (fromCurrency) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield fetch(`https://api.jup.ag/price/v2?ids=${fromCurrency}`);
        let jsonData = yield data.json();
        return jsonData.data[fromCurrency].price;
    }
    catch (error) {
        console.error("Error fetching conversion rate:", error);
        return null;
    }
});
exports.fetchConversionRate = fetchConversionRate;
const fetchTokenDetails = (mintAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetch(`${network}${__1.API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: "test",
                method: "getAsset",
                params: {
                    id: mintAddress,
                },
            }),
        });
        let jsonData = yield data.json();
        return jsonData.data;
    }
    catch (error) {
        console.error("Error fetching token details:", error);
        return null;
    }
});
exports.fetchTokenDetails = fetchTokenDetails;
const fetchTokenAccounts = (publickey) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${network}${__1.API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "text",
            method: "getAssetsByOwner",
            params: {
                ownerAddress: publickey.toBase58(),
                displayOptions: {
                    showFungible: true, //return both fungible and non-fungible tokens
                },
            },
        }),
    });
    const data = yield response.json();
    return data;
});
exports.fetchTokenAccounts = fetchTokenAccounts;
const getBalance = (publickey) => __awaiter(void 0, void 0, void 0, function* () {
    let connection = new web3_js_1.Connection(`${network}${__1.API_KEY}`);
    const balance = (yield connection.getBalance(publickey)) / 1e9;
    return balance;
});
exports.getBalance = getBalance;
