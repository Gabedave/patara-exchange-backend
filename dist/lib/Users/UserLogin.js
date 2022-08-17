"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogin = void 0;
const users_1 = require("../../models/UserModel/users");
const bcrypt = require("bcryptjs");
const AuthService_1 = require("../authentication/AuthService");
const UserDoesNotExist_1 = require("./exceptions/UserDoesNotExist");
const UserInvalidPassword_1 = require("./exceptions/UserInvalidPassword");
class UserLogin {
    constructor(userDetails, onUserVerified) {
        this.userDetails = userDetails;
        this.onUserVerified = onUserVerified;
    }
    async call() {
        const userDetails = await this.getUserDetails();
        await this.verifyUserPassword(userDetails);
        const authData = await this.generateUserAuthData(userDetails._id);
        delete userDetails["password_hash"];
        this.onUserVerified({ authData, userDetails });
    }
    async getUserDetails() {
        const findUser = await users_1.default.findOne({
            email: this.userDetails.email,
        });
        if (!findUser) {
            throw new UserDoesNotExist_1.default("User with email does not exist. You should sign up instead");
        }
        return findUser.toObject();
    }
    async verifyUserPassword(userDetails) {
        const match = await bcrypt.compare(this.userDetails.unHashedPassword, userDetails.password_hash);
        if (!match) {
            throw new UserInvalidPassword_1.default("Incorrect password. Please try again or reset your password");
        }
    }
    async generateUserAuthData(userId) {
        const authData = await new Promise((resolve, reject) => {
            AuthService_1.default.generateTokenForVerification(resolve, reject, {
                userId,
                email: this.userDetails.email,
                role: "user",
            });
        });
        return authData;
    }
}
exports.UserLogin = UserLogin;
