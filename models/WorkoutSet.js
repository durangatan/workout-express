import { Queryable } from './';

export default class WorkoutSet extends Queryable {
  constructor(args) {
    super();
    this.id = args.id;
    this.exerciseId = args.exerciseId;
    this.weight = args.weight;
    this.repetitions = args.repetitions;
    this.notes = args.notes;
    this.type = args.type || 'Default';
    this._exercise = args.exercise;
  }

  get exercise() {
    return this._exercise;
  }

  set exercise(exercise) {
    this._exercise = exercise;
  }

  toJSON() {
    return {
      id: this.id,
      exerciseId: this.exerciseId,
      weight: this.weight,
      repetitions: this.repetitions,
      notes: this.notes,
      type: this.type,
      exercise: this.exercise
    };
  }
}
