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
exports.findAction = findAction;
exports.executeAction = executeAction;
exports.getActionExamples = getActionExamples;
const actions_1 = require("../actions");
/**
 * Find an action by its name or one of its similes
 */
function findAction(query) {
    const normalizedQuery = query.toLowerCase().trim();
    return Object.values(actions_1.ACTIONS).find((action) => action.name.toLowerCase() === normalizedQuery ||
        action.similes.some((simile) => simile.toLowerCase() === normalizedQuery));
}
/**
 * Execute an action with the given input
 */
function executeAction(action, agent, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate input using Zod schema
            const validatedInput = action.schema.parse(input);
            // Execute the action with validated input
            const result = yield action.handler(agent, validatedInput);
            return Object.assign({ status: "success" }, result);
        }
        catch (error) {
            // Handle Zod validation errors specially
            if (error.errors) {
                return {
                    status: "error",
                    message: "Validation error",
                    details: error.errors,
                    code: "VALIDATION_ERROR",
                };
            }
            return {
                status: "error",
                message: error.message,
                code: error.code || "EXECUTION_ERROR",
            };
        }
    });
}
/**
 * Get examples for an action
 */
function getActionExamples(action) {
    return action.examples
        .flat()
        .map((example) => {
        return `Input: ${JSON.stringify(example.input, null, 2)}
Output: ${JSON.stringify(example.output, null, 2)}
Explanation: ${example.explanation}
---`;
    })
        .join("\n");
}
