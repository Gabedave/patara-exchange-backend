"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserInvalidPassword extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.default = UserInvalidPassword;
