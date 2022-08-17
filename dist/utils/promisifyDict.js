"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const promisifyDict = async (object) => {
    return _.zipObject(_.keys(object), await Promise.all(_.values(object)));
};
exports.default = promisifyDict;
