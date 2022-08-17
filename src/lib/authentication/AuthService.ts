const ENV_VARIABLES = process.env;
import { Router, Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
// import { CustomMailsNamespace } from "../CustomMails/custom_mails_namespace";
import { MailsNamespace } from "../Mails/mail_namespace";
import { ErrorsNamespace } from "../Errors/errors_namespace";
import { IUserRole } from "../Users/interface/UserInterface";

const generateLinkTokenForAccountUserResetPassword = (
  resolve,
  reject,
  userId: String,
  email: string
) => {
  let authObject = {
    userId: userId,
    email: email,
  };

  jwt.sign(
    authObject,
    ENV_VARIABLES.JWT_SECRET,
    {
      expiresIn: 43200, //12 hours
    },
    (err, token) => {
      if (err) {
        console.log(err + " error generating token for verification");
        return reject(err);
      }

      let resData = { auth: true, token: token };
      resolve(resData);

      const resetUrl = `${resData.token}`; // TODO: set reset url

      MailsNamespace.sendPasswordResetMail(email, resetUrl);
      return;
    }
  );
};

const generateTokenForVerification = (
  resolve,
  reject,
  userData: {
    userId: string;
    email: string;
    role: IUserRole;
  }
) => {
  let authObject = {
    ...userData,
  };

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

const decodeTokenInPasswordTokenLink = (token: string, resolve, reject) => {
  try {
    token = token.toString().trim();
  } catch (err) {
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

let VerifyUserToken = (req: Request, res: Response, next?: NextFunction) => {
  // let token = req.headers["x-access-token"] as string;
  if (
    !(
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
  ) {
    const message = "No token provided";
    ErrorsNamespace.logError({}, message);
    return res.status(401).send({ auth: false, message });
  }
  // Set token from Bearer token
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    const message = "No token provided";
    ErrorsNamespace.logError({}, message);
    return res.status(401).send({ auth: false, message });
  }

  jwt.verify(token, ENV_VARIABLES.JWT_SECRET, function (err, decoded: any) {
    if (err) {
      const message = "Failed to authenticate token";
      ErrorsNamespace.logError({}, message);
      return res.status(401).send({ auth: false, message });
    }

    req.body.token_data = {};

    if (decoded) {
      for (let i in decoded) {
        req.body.token_data[i] = decoded[i];
      }
    } else {
      const message = "token response is empty";
      ErrorsNamespace.logError({}, message);
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

export default AuthService;
