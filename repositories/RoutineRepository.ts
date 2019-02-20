import { DatabaseConnector, dbConfig } from '../db';

import { Routine } from '../models';

class RoutineRepository {
  constructor(databaseConnector = new DatabaseConnector(dbConfig)) {
    this.db = databaseConnector;
  }

  byId(id) {
    return this.db
      .query(`SELECT * FROM routines WHERE id =${id}`)
      .then(routines => routines.map(routine => new Routine(routine)));
  }
  all() {
    return this.db
      .query(`SELECT * FROM routines;`)
      .then(routines => routines.map(routine => new Routine(routine)));
  }
  save(routine) {
    return this.db.query(routine.upsertInto('routines'));
  }
}

let routineRepository;

export default function() {
  if (!routineRepository) {
    routineRepository = new RoutineRepository();
  }
  return routineRepository;
}
