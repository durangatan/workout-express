import { Queryable } from './';

export default class Exercise extends Queryable {
  constructor(params) {
    super();
    this.id = params.id;
    this.machineId = params.machineId;
    this.name = params.name;
    this.seatSetting = params.seatSetting;
    this.rangeSetting = params.rangeSetting;
    this.notes = params.notes;
  }
}
