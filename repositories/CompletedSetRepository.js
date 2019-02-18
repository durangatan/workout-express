import { DatabaseConnector, dbConfig } from '../db';
import { CompletedSet } from '../models';

class CompletedSetRepository {
  constructor(databaseConnection = new DatabaseConnector(dbConfig)) {
    this.db = databaseConnection;
  }

  byIdMulti(completedSetIds) {
    return this.db
      .query(`SELECT * from completed_sets WHERE id IN (${completedSetIds.join()});`)
      .then(sets => sets.map(set => new CompletedSet(set)));
  }

  insertMulti(completedSets) {
    const queryString = `INSERT INTO completed_sets (routineSetId,workoutId) VALUES ${completedSets
      .map(completedSet => new CompletedSet(completedSet).ownValuesQueryString)
      .join()};`;
    return this.db.query(queryString);
  }
}

let completedSetRepository;

export default function CompletedSetRepository() {
  if (!completedSetRepository) {
    completedSetRepository = new CompletedSetRepository();
  }
  return completedSetRepository;
}
