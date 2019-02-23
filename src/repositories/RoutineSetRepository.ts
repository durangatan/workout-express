import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '.';
import { RoutineSet, RoutineSetArguments, RoutineId } from 'workout-models';

export class RoutineSetRepository extends BaseRepository<RoutineSet, RoutineSetArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('routine_sets', (args: RoutineSetArguments) => new RoutineSet(args), databaseConnection);
  }

  byRoutineId(routineId: RoutineId) {
    return this.db.query(`SELECT * FROM routine_sets WHERE routineId =${String(routineId)}`);
  }
}

let routineSetRepository: RoutineSetRepository;

export default function() {
  if (!routineSetRepository) {
    routineSetRepository = new RoutineSetRepository();
  }
  return routineSetRepository;
}
