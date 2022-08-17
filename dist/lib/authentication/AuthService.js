"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ENV_VARIABLES = process.env;
const jwt = require("jsonwebtoken");
// import { CustomMailsNamespace } from "../CustomMails/custom_mails_namespace";
const mail_namespace_1 = require("../Mails/mail_namespace");
const errors_namespace_1 = require("../Errors/errors_namespace");
const generateLinkTokenForAccountUserResetPassword = (resolve, reject, userId, email) => {
    let authObject = {
        userId: userId,
        email: email,
    };
    jwt.sign(authObject, ENV_VARIABLES.JWT_SECRET, {
        expiresIn: 43200,
    }, (err, token) => {
        if (err) {
            console.log(err + " error generating token for verification");
            return reject(err);
        }
        let resData = { auth: true, token: token };
        resolve(resData);
        const resetUrl = `${resData.token}`; // TODO: set reset url
        mail_namespace_1.MailsNamespace.sendPasswordResetMail(email, resetUrl);
        return;
    });
};
const generateTokenForVerification = (resolve, reject, userData) => {
    let authObject = Object.assign({}, userData);
    jwt.sign(authObject, ENV_VARIABLES.JWT_SECRET, (err, token) => {
        if (err) {
            console.log(err + " error generating token for verification");
            return reject(err);
        }
        let resData = { auth: true, token: token };
        resolve(resData);
        return;
    });
};
const decodeTokenInPasswordTokenLink = (token, resolve, reject) => {
    try {
        token = token.toString().trim();
    }
    catch (err) {
        return reject({ auth: false, message: "Invalid token" });
    }
    jwt.verify(token, ENV_VARIABLES.JWT_SECRET, function (err, decoded) {
        if (err) {
            return reject({
                auth: false,
                err,
                message: "Failed to authenticate token.",
            });
        }
        if (decoded) {
            resolve(decoded);
        }
    });
};
let VerifyUserToken = (req, res, next) => {
    // let token = req.headers["x-access-token"] as string;
    if (!(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer"))) {
        const message = "No token provided";
        errors_namespace_1.ErrorsNamespace.logError({}, message);
        return res.status(401).send({ auth: false, message });
    }
    // Set token from Bearer token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        const message = "No token provided";
        errors_namespace_1.ErrorsNamespace.logError({}, message);
        return res.status(401).send({ auth: false, message });
    }
    jwt.verify(token, ENV_VARIABLES.JWT_SECRET, function (err, decoded) {
        if (err) {
            const message = "Failed to authenticate token";
            errors_namespace_1.ErrorsNamespace.logError({}, message);
            return res.status(401).send({ auth: false, message });
        }
        req.body.token_data = {};
        if (decoded) {
            for (let i in decoded) {
                req.body.token_data[i] = decoded[i];
            }
        }
        else {
            const message = "token response is empty";
            errors_namespace_1.ErrorsNamespace.logError({}, message);
            return Promise.reject(message);
        }
    });
    if (next) {
        next();
    }
    return req.body.token_data;
};
const AuthService = {
    VerifyUserToken,
    decodeTokenInPasswordTokenLink,
    generateTokenForVerification,
    generateLinkTokenForAccountUserResetPassword,
};
exports.default = AuthService;
