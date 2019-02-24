import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from '.';
import { ExerciseSet, ExerciseSetArguments } from 'workout-models';

export class ExerciseSetRepository extends BaseRepository<ExerciseSet, ExerciseSetArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('workout_sets', (args: ExerciseSetArguments) => new ExerciseSet(args), databaseConnection);
  }
}

let exerciseSetRepository: ExerciseSetRepository;

export default function() {
  if (!exerciseSetRepository) {
    exerciseSetRepository = new ExerciseSetRepository();
  }
  return exerciseSetRepository;
}
