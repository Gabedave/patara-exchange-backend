import * as util from "util";

export const ErrorsNamespace = {
  logError: async (_errObject, _message: any) => {
    const message =
      util.inspect(_message, true, 4, true) +
      util.inspect(_errObject, true, 4, true);
    console.log("Error", message);
  },
};
