import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '../repositories';
import { Routine, RoutineArguments } from 'workout-models';

export class RoutineRepository extends BaseRepository<Routine, RoutineArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('routines', (args: RoutineArguments) => new Routine(args), databaseConnection);
  }
}

let routineRepository: RoutineRepository;

export default function() {
  if (!routineRepository) {
    routineRepository = new RoutineRepository();
  }
  return routineRepository;
}
