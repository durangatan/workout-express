import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '.';
import { WorkoutRoutine, WorkoutRoutineArguments } from 'workout-models';

export class WorkoutRoutineRepository extends BaseRepository<WorkoutRoutine, WorkoutRoutineArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('workout_routines', (args: WorkoutRoutineArguments) => new WorkoutRoutine(args), databaseConnection);
  }
}

let workoutRoutineRepository: WorkoutRoutineRepository;

export default function() {
  if (!workoutRoutineRepository) {
    workoutRoutineRepository = new WorkoutRoutineRepository();
  }
  return workoutRoutineRepository;
}
