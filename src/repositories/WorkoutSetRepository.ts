import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '.';
import { WorkoutSet, WorkoutSetArguments } from 'workout-models';

export class WorkoutSetRepository extends BaseRepository<WorkoutSet, WorkoutSetArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('workout_sets', (args: WorkoutSetArguments) => new WorkoutSet(args), databaseConnection);
  }
}

let workoutSetRepository: WorkoutSetRepository;

export default function() {
  if (!workoutSetRepository) {
    workoutSetRepository = new WorkoutSetRepository();
  }
  return workoutSetRepository;
}
