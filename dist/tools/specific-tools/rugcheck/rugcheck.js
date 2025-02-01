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
exports.fetchTokenReportSummary = fetchTokenReportSummary;
exports.fetchTokenDetailedReport = fetchTokenDetailedReport;
const BASE_URL = "https://api.rugcheck.xyz/v1";
/**
 * Fetches a summary report for a specific token.
 * @async
 * @param {string} mint - The mint address of the token.
 * @returns {Promise<TokenCheck>} The token summary report.
 * @throws {Error} If the API call fails.
 */
function fetchTokenReportSummary(mint) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${BASE_URL}/tokens/${mint}/report/summary`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error(`Error fetching report summary for token ${mint}:`, error.message);
            throw new Error(`Failed to fetch report summary for token ${mint}.`);
        }
    });
}
/**
 * Fetches a detailed report for a specific token.
 * @async
 * @param {string} mint - The mint address of the token.
 * @returns {Promise<TokenCheck>} The detailed token report.
 * @throws {Error} If the API call fails.
 */
function fetchTokenDetailedReport(mint) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${BASE_URL}/tokens/${mint}/report`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error(`Error fetching detailed report for token ${mint}:`, error.message);
            throw new Error(`Failed to fetch detailed report for token ${mint}.`);
        }
    });
}
