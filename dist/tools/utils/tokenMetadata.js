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
exports.getTokenMetadata = getTokenMetadata;
const web3_js_1 = require("@solana/web3.js");
function getTokenMetadata(connection, tokenMint) {
    return __awaiter(this, void 0, void 0, function* () {
        const METADATA_PROGRAM_ID = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
        const [metadataPDA] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("metadata"),
            METADATA_PROGRAM_ID.toBuffer(),
            new web3_js_1.PublicKey(tokenMint).toBuffer(),
        ], METADATA_PROGRAM_ID);
        const metadata = yield connection.getAccountInfo(metadataPDA);
        if (!(metadata === null || metadata === void 0 ? void 0 : metadata.data)) {
            throw new Error("Metadata not found");
        }
        let offset = 1 + 32 + 32; // key + update auth + mint
        const data = metadata.data;
        const decoder = new TextDecoder();
        // Read variable length strings
        const readString = () => {
            let nameLength = data[offset];
            while (nameLength === 0) {
                offset++;
                nameLength = data[offset];
                if (offset >= data.length) {
                    return null;
                }
            }
            offset++;
            const name = decoder
                .decode(data.slice(offset, offset + nameLength))
                // @eslint-disable-next-line no-control-regex
                .replace(new RegExp(String.fromCharCode(0), "g"), "");
            offset += nameLength;
            return name;
        };
        const name = readString();
        const symbol = readString();
        const uri = readString();
        // Read remaining data
        const sellerFeeBasisPoints = data.readUInt16LE(offset);
        offset += 2;
        let creators = null;
        if (data[offset] === 1) {
            offset++;
            const numCreators = data[offset];
            offset++;
            creators = [...Array(numCreators)].map(() => {
                const creator = {
                    address: new web3_js_1.PublicKey(data.slice(offset, offset + 32)),
                    verified: data[offset + 32] === 1,
                    share: data[offset + 33],
                };
                offset += 34;
                return creator;
            });
        }
        return {
            name,
            symbol,
            uri,
            sellerFeeBasisPoints,
            creators,
        };
    });
}
