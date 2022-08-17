export default class UserWithEmailAlreadyExist extends Error {
  message: string;
  constructor(message) {
    super(message);
    this.message = message;
  }
}
