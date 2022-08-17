import { Request, Response, Router } from "express";
import userModel from "../../models/UserModel/users";
import * as bcrypt from "bcryptjs";
import AuthService from "../../lib/authentication/AuthService";
import * as UserNamespace from "../../lib/Users";
import UserWithEmailAlreadyExist from "../../lib/Users/exceptions/UserWithEmailAlreadyExist";
import UserDoesNotExist from "../../lib/Users/exceptions/UserDoesNotExist";
import UserInvalidPassword from "../../lib/Users/exceptions/UserInvalidPassword";
import { ValidateDataNamespace } from "../../utils/validation/validate_data_namespace";
import { ResponsesNamespace } from "../../utils/responses_namespace";

class AuthRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  async registerUser(req: Request, res: Response) {
    const _firstname = req.body.firstname;
    const _lastname = req.body.lastname;
    const _country = req.body.country;
    const _phone_number = req.body.phone_number;
    const _email = req.body.email;
    const _password = req.body.password;

    if (
      !ValidateDataNamespace.validateRequiredFieldsNotUndefined([
        _firstname,
        _lastname,
        _email,
        _password,
        _phone_number,
      ])
    ) {
      return ResponsesNamespace.sendRequiredParameterMissingError(req, res);
    }

    try {
      await UserNamespace.createUser(
        {
          email: _email,
          firstname: _firstname,
          lastname: _lastname,
          unHashedPassword: _password,
          phoneNumber: _phone_number,
          country: _country,
        },
        ({ authData, userDetails }) => {
          ResponsesNamespace.sendSuccess(
            res,
            { ...authData, ...userDetails },
            res.status(200).statusCode,
            "Login successful"
          );
        }
      );
    } catch (err) {
      console.log("error in creating account " + err);
      const errMessage =
        err instanceof UserWithEmailAlreadyExist
          ? err.message
          : "Error creating new user";

      ResponsesNamespace.sendError(
        req,
        res,
        { error: err },
        res.status(500).statusCode,
        errMessage
      );
    }
  }

  async loginUser(req: Request, res: Response) {
    const _email = req.body.email;
    const _password = req.body.password;

    if (!ValidateDataNamespace.validateRequiredFieldsNotUndefined([_email])) {
      ResponsesNamespace.sendRequiredParameterMissingError(
        req,
        res,
        "[UserAuthRouter.loginUser] required parameter missing or undefined"
      );
    }

    try {
      await UserNamespace.loginUser(
        {
          email: _email,
          unHashedPassword: _password,
        },
        ({ authData, userDetails }) => {
          ResponsesNamespace.sendSuccess(
            res,
            { ...authData, ...userDetails },
            res.status(200).statusCode,
            "Login successful"
          );
        }
      );
    } catch (err) {
      console.log("Error login user", err);
      let errMessage = "An error occurred. Please try again";

      if (err instanceof UserDoesNotExist) {
        errMessage = err.message;
      }

      if (err instanceof UserInvalidPassword) {
        errMessage = err.message;
      }

      ResponsesNamespace.sendError(
        req,
        res,
        { error: err },
        res.status(500).statusCode,
        errMessage
      );
    }
  }

  async requestResetPassword(req: Request, res: Response) {
    const _user_email = req.body.email;

    if (_user_email == undefined) {
      let _error = " missing parameters";
      let _code = res.status(400).statusCode;
      let _message = "one or more of the required parameter is missing";
      ResponsesNamespace.sendError(req, res, _error, _code, _message);
      return;
    }

    await userModel
      .findOne({ email: _user_email })
      .then((data) => {
        return new Promise((resolve, reject) => {
          AuthService.generateLinkTokenForAccountUserResetPassword(
            resolve,
            reject,
            data["_id"],
            data["email"]
          );
        });
      })
      .then((promiseRes) => {
        if (promiseRes["auth"]) {
          ResponsesNamespace.sendSuccess(
            res,
            {},
            res.status(200).statusCode,
            "password reset message sent to user email"
          );
        } else {
          ResponsesNamespace.sendError(
            req,
            res,
            {},
            res.status(400).statusCode,
            "User Details dont match"
          );
        }
      })
      .catch((err) => {
        ResponsesNamespace.sendError(
          req,
          res,
          err,
          res.status(500).statusCode,
          "Error resetting user password"
        );
      });
  }

  async createPassword(req: Request, res: Response) {
    const _token = req.body.token;
    const _user_email = req.body.email;
    let _password = req.body.password;

    if (
      !ValidateDataNamespace.validateRequiredFieldsNotUndefined([
        _token,
        _user_email,
        _password,
      ])
    ) {
      ResponsesNamespace.sendRequiredParameterMissingError(
        req,
        res,
        "one or more of the required parameter is missing"
      );
      return;
    }

    try {
      const promiseData = await new Promise((resolve, reject) => {
        AuthService.decodeTokenInPasswordTokenLink(_token, resolve, reject);
      });
      if (!promiseData) {
        ResponsesNamespace.sendError(
          req,
          res,
          {},
          401,
          "Invalid password token, Token might have expired"
        );
      }

      _password = await bcrypt.hash(_password, 2);

      const userData = await userModel.findOneAndUpdate(
        { _id: promiseData["user_id"], email: _user_email },
        { password_hash: _password },
        { new: true }
      );
      if (!userData) {
        ResponsesNamespace.sendError(
          req,
          res,
          {},
          500,
          "Password change invalid"
        );
        return;
      }
      ResponsesNamespace.sendSuccess(res, userData, 200);
      return;
    } catch (err) {
      ResponsesNamespace.sendError(req, res, err, 500, "Error saving password");
    }
  }

  init() {
    this.router.post("/reset-password", this.requestResetPassword);
    this.router.post("/create-password", this.createPassword);
    this.router.post("/register", this.registerUser);
    this.router.post("/login", this.loginUser);
  }
}

const userRoutes: AuthRouter = new AuthRouter();
userRoutes.init();

export default userRoutes.router;
