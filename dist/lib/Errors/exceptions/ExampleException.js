"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExampleException extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.default = ExampleException;
