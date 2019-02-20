import { DatabaseConnector, dbConfig } from '../db';
import { CompletedSet } from '../models';

class WorkoutSetRepository {
  constructor(databaseConnection = new DatabaseConnector(dbConfig)) {
    this.db = databaseConnection;
    this.byId = this.byId.bind(this);
    this.upsertMulti = this.upsertMulti.bind(this);
    this.deleteMulti = this.deleteMulti.bind(this);
    this.insert = this.insert.bind(this);
  }

  byIdMulti(workoutSetIds) {
    return this.db.query(
      `SELECT * FROM workout_sets WHERE id IN (${workoutSetIds.join()})`
    );
  }

  byId(workoutSetId) {
    return this.db.query(
      `SELECT * FROM workout_sets WHERE id = ${workoutSetId};`
    );
  }

  upsertMulti(workoutSets) {
    return this.deleteMulti(workoutSets).then(() => {
      return Promise.all(
        workoutSets.map(workoutSet => this.insert(workoutSet))
      );
    });
  }

  deleteMulti(workoutSets) {
    return this.db.query(
      `DELETE FROM workout_sets WHERE id IN (${workoutSets
        .map(workoutSet => workoutSet.id)
        .join()})`
    );
  }
  insert(workoutSet) {
    return this.db
      .query(workoutSet.insertInto('workout_sets'))
      .then(okPacket => this.byId(okPacket.insertId));
  }
}

let workoutSetRepository;

export default function() {
  if (!workoutSetRepository) {
    workoutSetRepository = new WorkoutSetRepository();
  }
  return workoutSetRepository;
}
