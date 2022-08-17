const validateRequiredFieldsNotUndefined = (fields: any[]) => {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] === undefined) {
      return false;
    }
  }
  return true;
};

const testIfTextContainsOnlyLetter = (text: string) => {
  let pattern = new RegExp(/^[A-Z]+$/i);
  return pattern.test(text);
};

export const ValidateDataNamespace = {
  validateRequiredFieldsNotUndefined,
  testIfTextContainsOnlyLetter,
};
