"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsNamespace = void 0;
const util = require("util");
exports.ErrorsNamespace = {
    logError: async (_errObject, _message) => {
        const message = util.inspect(_message, true, 4, true) +
            util.inspect(_errObject, true, 4, true);
        console.log("Error", message);
    },
};
