import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '.';
import Workout, { WorkoutArguments } from '../../../workout-models/Workout';

export class WorkoutRepository extends BaseRepository<Workout, WorkoutArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('workouts', (args: WorkoutArguments) => new Workout(args), databaseConnection);
  }
}

let workoutRepository: WorkoutRepository;

export default function() {
  if (!workoutRepository) {
    workoutRepository = new WorkoutRepository();
  }
  return workoutRepository;
}
