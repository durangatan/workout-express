import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from './';
import { Exercise } from '../../../workout-models';
import { ExerciseArguments } from '../../../workout-models/Exercise';

export class ExerciseRepository extends BaseRepository<Exercise, ExerciseArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('exercises', (args: ExerciseArguments) => new Exercise(args), databaseConnection);
  }
}

let exerciseRepository;

export default function() {
  if (!exerciseRepository) {
    exerciseRepository = new ExerciseRepository();
  }
  return exerciseRepository;
}
