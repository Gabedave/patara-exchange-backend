"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InternalError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.default = InternalError;
