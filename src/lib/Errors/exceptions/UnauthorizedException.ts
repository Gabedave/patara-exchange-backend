export default class UnauthorizedException extends Error {
  message: string;
  constructor(message) {
    super();
    this.message = message;
  }
}
