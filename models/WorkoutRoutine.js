import { Queryable } from './';

export default class WorkoutRoutine extends Queryable {
  constructor(args) {
    super();
    this.id = args.id;
    this.workoutId = args.workoutId;
    this.routineId = args.routineId;
  }
}
