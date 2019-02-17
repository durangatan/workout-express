import { DatabaseConnector, dbConfig } from '../db';
import { SetRepository } from './';
import { Routine } from '../models';

class RoutineRepository {
  constructor(databaseConnector = new DatabaseConnector(dbConfig), setRepository = SetRepository()) {
    this.db = databaseConnector;
    this.setRepository = setRepository;
  }

  byId(id) {
    const routinePromise = this.db.query(`SELECT * FROM routines WHERE id =${id}`);
    const setsPromise = this.setRepository.forRoutine(id);
    return Promise.all([routinePromise, setsPromise]).then(
      ([routines, sets]) => new Routine({ ...routines[0], sets: sets })
    );
  }
  all() {
    return this.db.query(`SELECT * FROM routines;`).then(routines => routines.map(routine => new Routine(routine)));
  }
}

let routineRepository;

export default function RoutineRepository() {
  if (!routineRepository) {
    routineRepository = new RoutineRepository();
  }
  return routineRepository;
}
