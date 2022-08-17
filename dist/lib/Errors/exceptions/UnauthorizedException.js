"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizedException extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.default = UnauthorizedException;
