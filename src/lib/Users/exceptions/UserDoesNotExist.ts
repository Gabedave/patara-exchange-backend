export default class UserDoesNotExist extends Error {
  message: string;
  constructor(message) {
    super(message);
    this.message = message;
  }
}
