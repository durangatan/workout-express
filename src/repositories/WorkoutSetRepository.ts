import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '.';
import { WorkoutSet } from '../../../workout-models';
import { WorkoutSetArguments } from '../../../workout-models/WorkoutSet';

export class WorkoutSetRepository extends BaseRepository<WorkoutSet, WorkoutSetArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('WorkoutSets', (args: WorkoutSetArguments) => new WorkoutSet(args), databaseConnection);
  }
}

let workoutSetRepository: WorkoutSetRepository;

export default function() {
  if (!workoutSetRepository) {
    workoutSetRepository = new WorkoutSetRepository();
  }
  return workoutSetRepository;
}
