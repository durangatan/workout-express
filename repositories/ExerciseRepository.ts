import { DatabaseConnector, dbConfig } from '../db';
import { Exercise } from '../models';

class ExerciseRepository {
  constructor(databaseConnection = new DatabaseConnector(dbConfig)) {
    this.db = databaseConnection;
  }

  byIdMulti(exerciseIds) {
    return this.db
      .query(`SELECT * from exercises WHERE id IN (${exerciseIds.join()});`)
      .then(exercises => exercises.map(exercise => new Exercise(exercise)));
  }

  all() {
    return this.db
      .query(`SELECT * from exercises;`)
      .then(exercises => exercises.map(exercise => new Exercise(exercise)));
  }
}

let exerciseRepository;

export default function() {
  if (!exerciseRepository) {
    exerciseRepository = new ExerciseRepository();
  }
  return exerciseRepository;
}
