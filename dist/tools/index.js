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
const gemini_1 = require("../requests/gemini");
const specific_tools_1 = require("./specific-tools");
class AgentTools {
    constructor() {
        // this.scraper = new Scraper();
    }
    rugCheckMinimal(mint, question) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, specific_tools_1.fetchTokenReportSummary)(mint);
            const convert = yield (0, gemini_1.interpret)(JSON.stringify(response), question);
            return convert;
        });
    }
    rugCheckDetailed(mint, question) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, specific_tools_1.fetchTokenDetailedReport)(mint);
            const convert = yield (0, gemini_1.interpret)(JSON.stringify(response), question);
            return convert;
        });
    }
}
exports.default = AgentTools;
