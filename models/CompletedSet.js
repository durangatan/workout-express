import { Queryable } from './';

export default class CompletedSet extends Queryable {
  constructor(args) {
    super();
    this.id = args.id;
    this.routineSetId = args.routineSetId;
    this.workoutId = args.workoutId;
  }
}
