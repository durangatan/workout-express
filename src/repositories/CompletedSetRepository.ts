import { DatabaseConnection, dbConfig } from '../db';
import { CompletedSet, CompletedSetArguments } from 'workout-models';
import { BaseRepository } from './';

export class CompletedSetRepository extends BaseRepository<CompletedSet, CompletedSetArguments> {
  constructor(databaseConnection = new DatabaseConnection(dbConfig)) {
    super('completed_sets', (args: CompletedSetArguments) => new CompletedSet(args), databaseConnection);
  }
}

let completedSetRepository: CompletedSetRepository;

export default function() {
  if (!completedSetRepository) {
    completedSetRepository = new CompletedSetRepository();
  }
  return completedSetRepository;
}
