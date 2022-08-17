export default class UserInvalidPassword extends Error {
  message: string;
  constructor(message) {
    super(message);
    this.message = message;
  }
}
