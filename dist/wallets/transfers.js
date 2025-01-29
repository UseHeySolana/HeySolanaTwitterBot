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
exports.getTokens = exports.transferSol = void 0;
const web3_js_1 = require("@solana/web3.js");
const helius_1 = require("./helius");
const transferSol = (fromAddres, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let connection = new web3_js_1.Connection(`${helius_1.network}${helius_1.API_KEY}`);
        // Create the transaction
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: new web3_js_1.PublicKey(fromAddres),
            toPubkey: new web3_js_1.PublicKey(toAddress),
            lamports: amount * Math.pow(10, 9), // Convert SOL to lamports
        }));
        // Set the fee payer
        transaction.feePayer = new web3_js_1.PublicKey(fromAddres);
        // Get a recent blockhash
        const { blockhash } = yield connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        // Serialize the transaction message (for sending to frontend)
        const serializedTransaction = transaction.serializeMessage();
        const serializedBase64 = Buffer.from(serializedTransaction).toString("base64");
        return serializedBase64;
    }
    catch (error) {
        console.error("Error transferring SOL:", error);
        throw error;
    }
});
exports.transferSol = transferSol;
// const transferToken = async (
//   toAddress: string,
//   tokenMintAddress: string,
//   amount: number,
//   decimals: number,
//   connection: Connection
// ) => {
//   try {
//     // Derive the sender's associated token account
//     const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
//       connection,
//       fromWallet,
//       new PublicKey(tokenMintAddress), // Token mint address
//       fromWallet.publicKey // Owner of the sender's token account
//     );
//     // Derive the recipient's associated token account
//     const toTokenAccount = await getOrCreateAssociatedTokenAccount(
//       connection,
//       fromWallet,
//       new PublicKey(tokenMintAddress),
//       new PublicKey(toAddress)
//     );
//     const tokenAmount = amount * Math.pow(10, decimals);
//     // Create the transfer instruction
//     const transferInstruction = createTransferInstruction(
//       fromTokenAccount.address, // Source token account
//       toTokenAccount.address, // Destination token account
//       fromWallet.publicKey, // Owner of the source token account
//       tokenAmount, // Amount to transfer (in smallest unit of the token)
//       [],
//       TOKEN_PROGRAM_ID
//     );
//     // Create and sign the transaction
//     const transaction = new Transaction().add(transferInstruction);
//     transaction.feePayer = fromWallet.publicKey;
//     // Get a recent blockhash
//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = fromWallet.publicKey;
//     // Sign the transaction
//     transaction.sign(fromWallet);
//     // Send and confirm the transaction
//     try {
//       const signature = await sendAndConfirmTransaction(
//         connection,
//         transaction,
//         [fromWallet]
//       );
//       console.log(`Token transfer successful with signature: ${signature}`);
//       return signature;
//     } catch (e) {
//       console.log(e);
//     }
//   } catch (error) {
//     console.error("Error transferring token:", error);
//     throw error;
//   }
// };
const toPublickKey = (address) => {
    return new web3_js_1.PublicKey(address);
};
const getTokens = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const Solbalance = yield (0, helius_1.getBalance)(toPublickKey(address));
    const rate = yield (0, helius_1.fetchConversionRate)("So11111111111111111111111111111111111111112");
    const balance = Number(Solbalance) * rate;
    let usdBalance = balance;
    const tokens = yield (0, helius_1.fetchTokenAccounts)(toPublickKey(address));
    const fungible = tokens.result.items
        .filter((item) => item.interface === "FungibleToken")
        .map((token) => {
        var _a, _b, _c, _d, _e, _f;
        const tokenInfo = token === null || token === void 0 ? void 0 : token.token_info;
        const content = (_a = token === null || token === void 0 ? void 0 : token.content) === null || _a === void 0 ? void 0 : _a.metadata;
        usdBalance +=
            ((_b = tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.price_info) === null || _b === void 0 ? void 0 : _b.total_price) == undefined
                ? 0
                : (_c = tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.price_info) === null || _c === void 0 ? void 0 : _c.total_price;
        return {
            name: content === null || content === void 0 ? void 0 : content.name,
            image: (_e = (_d = token === null || token === void 0 ? void 0 : token.content) === null || _d === void 0 ? void 0 : _d.links) === null || _e === void 0 ? void 0 : _e.image,
            symbol: content === null || content === void 0 ? void 0 : content.symbol,
            balance: (tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.balance) * Math.pow(10, -(tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.decimals)),
            decimals: tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.decimals,
            usdc_price: (_f = tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.price_info) === null || _f === void 0 ? void 0 : _f.total_price,
            mint: token === null || token === void 0 ? void 0 : token.id,
        };
    });
    return {
        balance: Number(balance.toFixed(2)),
        solBalance: Number(Solbalance === null || Solbalance === void 0 ? void 0 : Solbalance.toFixed(4)),
        tokenAccounts: tokens ? fungible : [],
        totalUsdBalance: usdBalance,
    };
});
exports.getTokens = getTokens;
