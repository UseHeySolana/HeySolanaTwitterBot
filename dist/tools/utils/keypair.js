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
exports.Wallet = exports.keypair = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.keypair = web3_js_1.Keypair.generate();
class Wallet {
    constructor(signer) {
        this._signer = signer;
    }
    signTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tx instanceof web3_js_1.Transaction) {
                tx.sign(this._signer);
            }
            else if (tx instanceof web3_js_1.VersionedTransaction) {
                tx.sign([this._signer]);
            }
            else {
                throw new Error("Unsupported transaction type");
            }
            return tx;
        });
    }
    signAllTransactions(txs) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(txs.map((tx) => this.signTransaction(tx)));
        });
    }
    get publicKey() {
        return this._signer.publicKey;
    }
}
exports.Wallet = Wallet;
