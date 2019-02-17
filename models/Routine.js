import { Queryable } from './';
export default class Routine extends Queryable {
  constructor(args) {
    super();
    this.id = args.id;
    this.name = args.name;
    this._sets = args.sets;
  }

  get sets() {
    return this._sets;
  }

  set sets(sets) {
    if (typeof sets === 'array') this._sets = sets;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      sets: this.sets
    };
  }
}
