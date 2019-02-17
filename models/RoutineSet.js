import { Queryable } from './';

export default class RoutineSet extends Queryable {
  constructor(args) {
    super();
    this.id = args.id;
    this.routineId = args.routineId;
    this.setId = args.setId;
    this.ordering = args.ordering;
  }
}
