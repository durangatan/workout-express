import { DatabaseConnector, dbConfig } from '../db';
import { Exercise } from '../models';

class WorkoutRepository {
  constructor(databaseConnection = new DatabaseConnector(dbConfig)) {
    this.db = databaseConnection;
  }

  all() {
    return this.db.query(`SELECT * from workouts;`);
  }

  byId(exerciseId) {
    return this.db.query(`SELECT * from workouts where id = ${exerciseId} LIMIT 1;`);
  }

  byIdMulti(exerciseIds) {
    return this.db
      .query(`SELECT * from workouts WHERE id IN (${exerciseIds.join()});`)
      .then(exercises => exercises.map(exercise => new Exercise(exercise)));
  }

  insert(workout) {
    return this.db.query(workout.insertInto('workouts')).then(okPacket => this.byId(okPacket.insertId));
  }
}

let workoutRepository;

export default function WorkoutRepository() {
  if (!workoutRepository) {
    workoutRepository = new WorkoutRepository();
  }
  return workoutRepository;
}
