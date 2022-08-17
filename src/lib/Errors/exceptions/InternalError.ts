export default class InternalError extends Error {
  message: string;
  constructor(message) {
    super();
    this.message = message;
  }
}
