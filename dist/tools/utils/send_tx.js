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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComputeBudgetInstructions = getComputeBudgetInstructions;
exports.sendTx = sendTx;
const web3_js_1 = require("@solana/web3.js");
const web3_js_2 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const feeTiers = {
    min: 0.01,
    mid: 0.5,
    max: 0.95,
};
/**
 * Get priority fees for the current block
 * @param connection - Solana RPC connection
 * @returns Priority fees statistics and instructions for different fee levels
 */
function getComputeBudgetInstructions(agent, instructions, feeTier) {
    return __awaiter(this, void 0, void 0, function* () {
        const { blockhash, lastValidBlockHeight } = yield agent.connection.getLatestBlockhash();
        const messageV0 = new web3_js_1.TransactionMessage({
            payerKey: agent.wallet_address,
            recentBlockhash: blockhash,
            instructions: instructions,
        }).compileToV0Message();
        const transaction = new web3_js_1.VersionedTransaction(messageV0);
        const simulatedTx = agent.connection.simulateTransaction(transaction);
        const estimatedComputeUnits = (yield simulatedTx).value.unitsConsumed;
        const safeComputeUnits = Math.ceil(estimatedComputeUnits
            ? Math.max(estimatedComputeUnits + 100000, estimatedComputeUnits * 1.2)
            : 200000);
        const computeBudgetLimitInstruction = web3_js_2.ComputeBudgetProgram.setComputeUnitLimit({
            units: safeComputeUnits,
        });
        let priorityFee;
        if (agent.config.HELIUS_API_KEY) {
            // Create and set up a legacy transaction for Helius fee estimation
            const legacyTransaction = new web3_js_1.Transaction();
            legacyTransaction.recentBlockhash = blockhash;
            legacyTransaction.lastValidBlockHeight = lastValidBlockHeight;
            legacyTransaction.feePayer = agent.wallet_address;
            // Add the compute budget instruction and original instructions
            legacyTransaction.add(computeBudgetLimitInstruction, ...instructions);
            // Sign the transaction
            legacyTransaction.sign(agent.wallet);
            // Use Helius API for priority fee calculation
            const response = yield fetch(`https://mainnet.helius-rpc.com/?api-key=${agent.config.HELIUS_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: "1",
                    method: "getPriorityFeeEstimate",
                    params: [
                        {
                            transaction: bs58_1.default.encode(legacyTransaction.serialize()),
                            options: {
                                priorityLevel: feeTier === "min"
                                    ? "Min"
                                    : feeTier === "mid"
                                        ? "Medium"
                                        : "High",
                            },
                        },
                    ],
                }),
            });
            const data = yield response.json();
            if (data.error) {
                throw new Error("Error fetching priority fee from Helius API");
            }
            priorityFee = data.result.priorityFeeEstimate;
        }
        else {
            // Use default implementation for priority fee calculation
            priorityFee = yield agent.connection
                .getRecentPrioritizationFees()
                .then((fees) => fees.sort((a, b) => a.prioritizationFee - b.prioritizationFee)[Math.floor(fees.length * feeTiers[feeTier])].prioritizationFee);
        }
        const computeBudgetPriorityFeeInstructions = web3_js_2.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: priorityFee,
        });
        return {
            blockhash,
            computeBudgetLimitInstruction,
            computeBudgetPriorityFeeInstructions,
        };
    });
}
/**
 * Send a transaction with priority fees
 * @param agent - SolanaAgentKit instance
 * @param tx - Transaction to send
 * @returns Transaction ID
 */
function sendTx(agent, instructions, otherKeypairs) {
    return __awaiter(this, void 0, void 0, function* () {
        const ixComputeBudget = yield getComputeBudgetInstructions(agent, instructions, "mid");
        const allInstructions = [
            ixComputeBudget.computeBudgetLimitInstruction,
            ixComputeBudget.computeBudgetPriorityFeeInstructions,
            ...instructions,
        ];
        const messageV0 = new web3_js_1.TransactionMessage({
            payerKey: agent.wallet_address,
            recentBlockhash: ixComputeBudget.blockhash,
            instructions: allInstructions,
        }).compileToV0Message();
        const transaction = new web3_js_1.VersionedTransaction(messageV0);
        transaction.sign([agent.wallet, ...(otherKeypairs !== null && otherKeypairs !== void 0 ? otherKeypairs : [])]);
        const timeoutMs = 90000;
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            const transactionStartTime = Date.now();
            const signature = yield agent.connection.sendTransaction(transaction, {
                maxRetries: 0,
                skipPreflight: false,
            });
            const statuses = yield agent.connection.getSignatureStatuses([signature]);
            if (statuses.value[0]) {
                if (!statuses.value[0].err) {
                    return signature;
                }
                else {
                    throw new Error(`Transaction failed: ${statuses.value[0].err.toString()}`);
                }
            }
            const elapsedTime = Date.now() - transactionStartTime;
            const remainingTime = Math.max(0, 1000 - elapsedTime);
            if (remainingTime > 0) {
                yield new Promise((resolve) => setTimeout(resolve, remainingTime));
            }
        }
        throw new Error("Transaction timeout");
    });
}
