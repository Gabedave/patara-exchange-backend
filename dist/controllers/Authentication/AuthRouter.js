"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../../models/UserModel/users");
const bcrypt = require("bcryptjs");
const AuthService_1 = require("../../lib/authentication/AuthService");
const UserNamespace = require("../../lib/Users");
const UserWithEmailAlreadyExist_1 = require("../../lib/Users/exceptions/UserWithEmailAlreadyExist");
const UserDoesNotExist_1 = require("../../lib/Users/exceptions/UserDoesNotExist");
const UserInvalidPassword_1 = require("../../lib/Users/exceptions/UserInvalidPassword");
const validate_data_namespace_1 = require("../../utils/validation/validate_data_namespace");
const responses_namespace_1 = require("../../utils/responses_namespace");
class AuthRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    async registerUser(req, res) {
        const _firstname = req.body.firstname;
        const _lastname = req.body.lastname;
        const _country = req.body.country;
        const _phone_number = req.body.phone_number;
        const _email = req.body.email;
        const _password = req.body.password;
        if (!validate_data_namespace_1.ValidateDataNamespace.validateRequiredFieldsNotUndefined([
            _firstname,
            _lastname,
            _email,
            _password,
            _phone_number,
        ])) {
            return responses_namespace_1.ResponsesNamespace.sendRequiredParameterMissingError(req, res);
        }
        try {
            await UserNamespace.createUser({
                email: _email,
                firstname: _firstname,
                lastname: _lastname,
                unHashedPassword: _password,
                phoneNumber: _phone_number,
                country: _country,
            }, ({ authData, userDetails }) => {
                responses_namespace_1.ResponsesNamespace.sendSuccess(res, Object.assign(Object.assign({}, authData), userDetails), res.status(200).statusCode, "Login successful");
            });
        }
        catch (err) {
            console.log("error in creating account " + err);
            const errMessage = err instanceof UserWithEmailAlreadyExist_1.default
                ? err.message
                : "Error creating new user";
            responses_namespace_1.ResponsesNamespace.sendError(req, res, { error: err }, res.status(500).statusCode, errMessage);
        }
    }
    async loginUser(req, res) {
        const _email = req.body.email;
        const _password = req.body.password;
        if (!validate_data_namespace_1.ValidateDataNamespace.validateRequiredFieldsNotUndefined([_email])) {
            responses_namespace_1.ResponsesNamespace.sendRequiredParameterMissingError(req, res, "[UserAuthRouter.loginUser] required parameter missing or undefined");
        }
        try {
            await UserNamespace.loginUser({
                email: _email,
                unHashedPassword: _password,
            }, ({ authData, userDetails }) => {
                responses_namespace_1.ResponsesNamespace.sendSuccess(res, Object.assign(Object.assign({}, authData), userDetails), res.status(200).statusCode, "Login successful");
            });
        }
        catch (err) {
            console.log("Error login user", err);
            let errMessage = "An error occurred. Please try again";
            if (err instanceof UserDoesNotExist_1.default) {
                errMessage = err.message;
            }
            if (err instanceof UserInvalidPassword_1.default) {
                errMessage = err.message;
            }
            responses_namespace_1.ResponsesNamespace.sendError(req, res, { error: err }, res.status(500).statusCode, errMessage);
        }
    }
    async requestResetPassword(req, res) {
        const _user_email = req.body.email;
        if (_user_email == undefined) {
            let _error = " missing parameters";
            let _code = res.status(400).statusCode;
            let _message = "one or more of the required parameter is missing";
            responses_namespace_1.ResponsesNamespace.sendError(req, res, _error, _code, _message);
            return;
        }
        await users_1.default
            .findOne({ email: _user_email })
            .then((data) => {
            return new Promise((resolve, reject) => {
                AuthService_1.default.generateLinkTokenForAccountUserResetPassword(resolve, reject, data["_id"], data["email"]);
            });
        })
            .then((promiseRes) => {
            if (promiseRes["auth"]) {
                responses_namespace_1.ResponsesNamespace.sendSuccess(res, {}, res.status(200).statusCode, "password reset message sent to user email");
            }
            else {
                responses_namespace_1.ResponsesNamespace.sendError(req, res, {}, res.status(400).statusCode, "User Details dont match");
            }
        })
            .catch((err) => {
            responses_namespace_1.ResponsesNamespace.sendError(req, res, err, res.status(500).statusCode, "Error resetting user password");
        });
    }
    async createPassword(req, res) {
        const _token = req.body.token;
        const _user_email = req.body.email;
        let _password = req.body.password;
        if (!validate_data_namespace_1.ValidateDataNamespace.validateRequiredFieldsNotUndefined([
            _token,
            _user_email,
            _password,
        ])) {
            responses_namespace_1.ResponsesNamespace.sendRequiredParameterMissingError(req, res, "one or more of the required parameter is missing");
            return;
        }
        try {
            const promiseData = await new Promise((resolve, reject) => {
                AuthService_1.default.decodeTokenInPasswordTokenLink(_token, resolve, reject);
            });
            if (!promiseData) {
                responses_namespace_1.ResponsesNamespace.sendError(req, res, {}, 401, "Invalid password token, Token might have expired");
            }
            _password = await bcrypt.hash(_password, 2);
            const userData = await users_1.default.findOneAndUpdate({ _id: promiseData["user_id"], email: _user_email }, { password_hash: _password }, { new: true });
            if (!userData) {
                responses_namespace_1.ResponsesNamespace.sendError(req, res, {}, 500, "Password change invalid");
                return;
            }
            responses_namespace_1.ResponsesNamespace.sendSuccess(res, userData, 200);
            return;
        }
        catch (err) {
            responses_namespace_1.ResponsesNamespace.sendError(req, res, err, 500, "Error saving password");
        }
    }
    init() {
        this.router.post("/reset-password", this.requestResetPassword);
        this.router.post("/create-password", this.createPassword);
        this.router.post("/register", this.registerUser);
        this.router.post("/login", this.loginUser);
    }
}
const userRoutes = new AuthRouter();
userRoutes.init();
exports.default = userRoutes.router;
