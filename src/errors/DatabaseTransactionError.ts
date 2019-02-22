export default class DatabaseTransactionError extends Error {
  constructor(message: string) {
    super(message);
  }
}
