import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '.';
import { Workout, WorkoutArguments, WithId } from 'workout-models';
import { WorkoutIncompleteError } from '../errors';

export class WorkoutRepository extends BaseRepository<Workout, WorkoutArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('workouts', (args: WorkoutArguments) => new Workout(args), databaseConnection);
  }

  saveWithSets(workout: Workout) {
    if (!(workout.routines && workout.routines.length)) {
      return Promise.reject(new WorkoutIncompleteError('This workout contains no routines'));
    }
    if (!(workout.completedExerciseSets && workout.completedExerciseSets.length)) {
      return Promise.reject(new WorkoutIncompleteError('This workout contains no completed sets'));
    }
  }
}

let workoutRepository: WorkoutRepository;

export default function() {
  if (!workoutRepository) {
    workoutRepository = new WorkoutRepository();
  }
  return workoutRepository;
}
