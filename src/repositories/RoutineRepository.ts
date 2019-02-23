import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '../repositories';
import { Routine } from '../../../workout-models';
import { RoutineArguments } from '../../../workout-models/Routine';

export class RoutineRepository extends BaseRepository<Routine, RoutineArguments> {
  save(routine: any): any {
    throw new Error("Method not implemented.");
  }
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
