import { Request, Response } from "express";
import * as util from "util";
import { ErrorsNamespace } from "../lib/Errors/errors_namespace";

const sendSuccess = (
  res: Response,
  data: any,
  code: number,
  message: String = ""
) => {
  let body = {
    error: false,
    data: data,
    code: res.status(code).statusCode,
    message: message,
  };
  res.send(body);
};

const sendError = (
  req: Request,
  res: Response,
  err: any,
  code: number,
  message: String = ""
) => {
  let body = {
    error: true,
    details: err,
    code: res.status(code).statusCode,
    message: message,
  };
  res.send(body);

  message = `
  ${message}
  <br/>
  <br/>
 Body: ${util.inspect(req.body)}
 <br/>
 Params: ${util.inspect(req.params)}
 <br/>
 Hostname: ${util.inspect(req.hostname)}
 <br/>
 Query: ${util.inspect(req.query)}
 <br/>
 URL: ${util.inspect(req.url)}
 <br/>
 BaseURL: ${util.inspect(req.baseUrl)}
 <br/>
Method: ${util.inspect(req.method)}
<br/>
URL: ${util.inspect(req.originalUrl)}
<br>
Headers host: ${util.inspect(req.headers.host)}
<br>
Header referrer: ${util.inspect(req.headers.referrer)}
  `;
  ErrorsNamespace.logError(err, message);
};

const sendRequiredParameterMissingError = (
  req: Request,
  res: Response,
  logComment: String = ""
) => {
  console.log("parameters are missing", logComment);
  sendError(
    req,
    res,
    {},
    res.status(400).statusCode,
    "one or more parameters missing from body"
  );
};

export const ResponsesNamespace = {
  sendSuccess: sendSuccess,
  sendError: sendError,
  sendRequiredParameterMissingError,
};
