import { GetCompletedSetRepository } from '../repositories';
import { CompletedSetRepository } from '../repositories/CompletedSetRepository';
import { CompletedSet, CompletedSetId, RoutineSet, WorkoutId } from 'workout-models';

export class CompletedSetService {
  completedSetRepository: CompletedSetRepository;

  constructor(completedSetRepository = GetCompletedSetRepository()) {
    this.completedSetRepository = completedSetRepository;
  }

  getById(id: CompletedSetId) {
    return this.completedSetRepository.byId(id);
  }
  all() {
    return this.completedSetRepository.all();
  }

  saveForWorkout(completedRoutineSets: Array<RoutineSet>, workoutId: WorkoutId) {
    const completedSets = completedRoutineSets.map(
      routineSet => new CompletedSet({ routineSetId: routineSet.id, workoutId })
    );
    this.completedSetRepository.insertMultiple(completedSets);
  }
}

let completedSetService;
export function GetCompletedSetService() {
  if (!completedSetService) {
    completedSetService = new CompletedSetService();
  }
  return completedSetService;
}
