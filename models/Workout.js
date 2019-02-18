import { Queryable } from './';

export default class Workout extends Queryable {
  constructor(args) {
    super();
    this.id = args.id;
    this.startTime = args.startTime;
    this.endTime = args.endTime;
    this._completedSets = args.completedSets;
    this._routines = args.routines;
  }

  get completedSets() {
    return this._completedSets;
  }

  set completedSets(completedSets) {
    this._completedSets = completedSets;
  }

  get routines() {
    return this._routines;
  }

  set routines(routines) {
    this._routines = routines;
  }
}
