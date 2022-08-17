"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserWithEmailAlreadyExist extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.default = UserWithEmailAlreadyExist;
