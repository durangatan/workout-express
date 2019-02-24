import { DatabaseConnection, dbConfig } from '../db';
import { BaseRepository } from './';
import { Exercise, ExerciseArguments } from 'workout-models';

export class ExerciseRepository extends BaseRepository<Exercise, ExerciseArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('exercises', (args: ExerciseArguments) => new Exercise(args), databaseConnection);
  }
}

let exerciseRepository: ExerciseRepository;

export default function() {
  if (!exerciseRepository) {
    exerciseRepository = new ExerciseRepository();
  }
  return exerciseRepository;
}
