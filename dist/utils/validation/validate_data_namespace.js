"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateDataNamespace = void 0;
const validateRequiredFieldsNotUndefined = (fields) => {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i] === undefined) {
            return false;
        }
    }
    return true;
};
const testIfTextContainsOnlyLetter = (text) => {
    let pattern = new RegExp(/^[A-Z]+$/i);
    return pattern.test(text);
};
exports.ValidateDataNamespace = {
    validateRequiredFieldsNotUndefined,
    testIfTextContainsOnlyLetter,
};
