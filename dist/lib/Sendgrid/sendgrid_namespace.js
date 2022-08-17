"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendgridNamespace = void 0;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendMail = async (opts) => {
    console.log("[SendgridNamespace.sendMail] ", { opts });
    sgMail.send(opts);
};
exports.SendgridNamespace = {
    sendMail,
};
