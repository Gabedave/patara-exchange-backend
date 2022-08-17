import { ResponsesNamespace } from "../../utils/responses_namespace";
import { ErrorsNamespace } from "./errors_namespace";

export default function handleAppError(err, req, res) {
  const { statusCode, message } = err;
  console.log(
    "[AppErrorHandler.handleAppError] Unhandled error in backend",
    err
  );

  ResponsesNamespace.sendError(req, res, {}, statusCode, "An error occurred.");

  ErrorsNamespace.logError(err, `[AppErrorHandler.handleAppError] err.message`);
}
