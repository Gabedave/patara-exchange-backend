"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailsNamespace = void 0;
const sendgrid_namespace_1 = require("../Sendgrid/sendgrid_namespace");
const sendPasswordResetMail = (email, resetUrl) => {
    const subject = "Password Reset Link";
    const message = `
            <p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the <a href=${resetUrl} target="_blank">link</a> to reset your password</p>
        `;
    const opts = {
        to: email,
        from: "noreply@.com",
        subject,
        text: "Password reset email link",
        html: message,
    };
    console.log("[SendgridNamespace.sendPasswordResetMail] ", { email, opts });
    return sendgrid_namespace_1.SendgridNamespace.sendMail(opts);
};
exports.MailsNamespace = {
    sendPasswordResetMail,
};
