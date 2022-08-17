"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreator = void 0;
const users_1 = require("../../models/UserModel/users");
const UserWithEmailAlreadyExist_1 = require("./exceptions/UserWithEmailAlreadyExist");
const bcrypt = require("bcryptjs");
const AuthService_1 = require("../authentication/AuthService");
class UserCreator {
    constructor(userDetails, onUserCreated) {
        this.userDetails = userDetails;
        this.onUserCreated = onUserCreated;
    }
    async call() {
        await this.checkIfUserWithEmailExist();
        await this.hashPasswordIfPresent();
        const userDetails = await this.createUser();
        const authData = await this.generateUserAuthData(userDetails._id);
        this.onUserCreated({ authData, userDetails });
    }
    async checkIfUserWithEmailExist() {
        const findUser = await users_1.default.findOne({
            email: this.userDetails.email,
        });
        if (findUser) {
            throw new UserWithEmailAlreadyExist_1.default("A user with this email already exist. You should sign in instead");
        }
    }
    async hashPasswordIfPresent() {
        if (this.userDetails.unHashedPassword) {
            this.hashedPassword = await bcrypt.hash(this.userDetails.unHashedPassword, 2);
        }
    }
    async createUser() {
        const userDetailsObject = await users_1.default.create({
            firstname: this.userDetails.firstname,
            lastname: this.userDetails.lastname,
            email: this.userDetails.email,
            password_hash: this.hashedPassword || undefined,
            phone_number: this.userDetails.phoneNumber,
            country: this.userDetails.country,
            picture: this.userDetails.picture,
        });
        const userDetails = userDetailsObject.toObject();
        delete userDetails["password_hash"];
        return userDetails;
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
exports.UserCreator = UserCreator;
