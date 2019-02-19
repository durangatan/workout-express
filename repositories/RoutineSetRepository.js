import { DatabaseConnector, dbConfig } from '../db';

class RoutineSetRepository {
  constructor(databaseConnection = new DatabaseConnector(dbConfig)) {
    this.db = databaseConnection;
    this.byId = this.byId.bind(this);
    this.upsertMulti = this.upsertMulti.bind(this);
    this.deleteMulti = this.deleteMulti.bind(this);
    this.insert = this.insert.bind(this);
  }

  byId(workoutSetId) {
    return this.db.query(`SELECT * FROM routine_sets WHERE id = ${workoutSetId};`);
  }
  byRoutineId(routineId) {
    return this.db.query(`SELECT * FROM routine_sets WHERE routineId =${routineId}`);
  }

  upsertMulti(routineSets) {
    return this.deleteMulti(routineSets).then(() => {
      return Promise.all(routineSets.map(routineSet => this.insert(routineSet)));
    });
  }

  deleteMulti(routineSets) {
    return this.db.query(
      `DELETE FROM routine_sets WHERE (routineId,setId) IN (${routineSets
        .map(routineSet => `(${routineSet.routineId},${routineSet.setId})`)
        .join()})`
    );
  }
  insert(routineSet) {
    return this.db.query(routineSet.insertInto('routine_sets')).then(okPacket => this.byId(okPacket.insertId));
  }
}

let routineSetRepository;

export default function RoutineSetRepository() {
  if (!routineSetRepository) {
    routineSetRepository = new RoutineSetRepository();
  }
  return routineSetRepository;
}
