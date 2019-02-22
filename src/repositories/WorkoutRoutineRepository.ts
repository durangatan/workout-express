import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '.';
import WorkoutRoutine, { WorkoutRoutineArguments } from '../../../workout-models/WorkoutRoutine';

export class WorkoutRoutineRepository extends BaseRepository<WorkoutRoutine, WorkoutRoutineArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('WorkoutRoutines', (args: WorkoutRoutineArguments) => new WorkoutRoutine(args), databaseConnection);
  }
}

let workoutRoutineRepository;

export default function() {
  if (!workoutRoutineRepository) {
    workoutRoutineRepository = new WorkoutRoutineRepository();
  }
  return workoutRoutineRepository;
}
