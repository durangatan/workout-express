export default class WorkoutIncompleteError extends Error {
  constructor(message: string) {
    super(message);
  }
}
