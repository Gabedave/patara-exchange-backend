import * as _ from "lodash";

const promisifyDict = async (object: Object) => {
  return _.zipObject(_.keys(object), await Promise.all(_.values(object)));
};

export default promisifyDict
