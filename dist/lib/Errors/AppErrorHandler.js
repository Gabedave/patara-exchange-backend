"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responses_namespace_1 = require("../../utils/responses_namespace");
const errors_namespace_1 = require("./errors_namespace");
function handleAppError(err, req, res) {
    const { statusCode, message } = err;
    console.log("[AppErrorHandler.handleAppError] Unhandled error in backend", err);
    responses_namespace_1.ResponsesNamespace.sendError(req, res, {}, statusCode, "An error occurred.");
    errors_namespace_1.ErrorsNamespace.logError(err, `[AppErrorHandler.handleAppError] err.message`);
}
exports.default = handleAppError;
