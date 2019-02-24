import { DatabaseConnection, dbConfig } from '../db';
import { CompletedSet, CompletedSetArguments, WorkoutId } from 'workout-models';
import { BaseRepository } from './';

export class CompletedSetRepository extends BaseRepository<CompletedSet, CompletedSetArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('completed_sets', (args: CompletedSetArguments) => new CompletedSet(args), databaseConnection);
  }
  byWorkoutId(workoutId: WorkoutId) {
    return this.db.query(this.sequelizer.select([this.sequelizer.where('workoutId', '=')]), workoutId);
  }

}

let completedSetRepository: CompletedSetRepository;

export default function() {
  if (!completedSetRepository) {
    completedSetRepository = new CompletedSetRepository();
  }
  return completedSetRepository;
}
