export default class EmptyQueryError extends Error {
  constructor(
    message: string = 'There were no records provided for this query'
  ) {
    super(message);
  }
}
