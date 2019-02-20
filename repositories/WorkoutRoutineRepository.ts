import { DatabaseConnector, dbConfig } from '../db';
import { WorkoutRoutine } from '../models';

class WorkoutRoutineRepository {
  constructor(databaseConnection = new DatabaseConnector(dbConfig)) {
    this.db = databaseConnection;
  }

  byIdMulti(exerciseIds) {
    return this.db
      .query(
        `SELECT * from workout_routines WHERE id IN (${exerciseIds.join()});`
      )
      .then(workoutRoutines =>
        workoutRoutines.map(
          workoutRoutine => new WorkoutRoutine(workoutRoutine)
        )
      );
  }

  insert(workoutRoutine) {
    return this.db
      .query(new WorkoutRoutine(workoutRoutine).insertInto('workout_routines'))
      .then(okPacket =>
        this.db.query(
          `SELECT * from workout_routines where id = ${
            okPacket.insertId
          } LIMIT 1;`
        )
      );
  }
}

let workoutRoutineRepository;

export default function() {
  if (!workoutRoutineRepository) {
    workoutRoutineRepository = new WorkoutRoutineRepository();
  }
  return workoutRoutineRepository;
}
