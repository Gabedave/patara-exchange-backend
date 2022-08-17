export default class ExampleException extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
