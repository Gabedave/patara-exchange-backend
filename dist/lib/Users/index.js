"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = exports.doesEmailBelongToAUser = exports.findUserByEmail = exports.findUserById = void 0;
const users_1 = require("../../models/UserModel/users");
const UserCreator_1 = require("./UserCreator");
const UserLogin_1 = require("./UserLogin");
exports.findUserById = async (user_id) => {
    return users_1.default.findOne({ _id: user_id, deleted: { $ne: true } });
};
exports.findUserByEmail = async (email) => {
    return users_1.default.findOne({ email: email, deleted: { $ne: true } });
};
exports.doesEmailBelongToAUser = async (email) => {
    return !!(await users_1.default.findOne({
        email: email,
        deleted: { $ne: true },
    }));
};
exports.createUser = async (userDetails, onUserCreated) => {
    return new UserCreator_1.UserCreator(userDetails, onUserCreated).call();
};
exports.loginUser = async (userDetails, onVerifyUser) => {
    return new UserLogin_1.UserLogin(userDetails, onVerifyUser).call();
};
