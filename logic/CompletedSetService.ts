import { CompletedSetRepository } from '../repositories';
import { CompletedSet } from '../models';

class CompletedSetService {
  constructor(completedSetRepository = CompletedSetRepository()) {
    this.completedSetRepository = completedSetRepository;
    this.getById = this.getById.bind(this);
  }
  getById(id) {
    return this.completedSetRepository.byId(id);
  }
  all() {
    return this.completedSetRepository.all();
  }

  saveForWorkout(completedRoutineSets, workoutId) {
    const completedSets = completedRoutineSets.map(
      routineSet => new CompletedSet({ routineSetId: routineSet.id, workoutId })
    );
    this.completedSetRepository.insertMulti(completedSets);
  }
}

let completedSetService;
export default function() {
  if (!completedSetService) {
    completedSetService = new CompletedSetService();
  }
  return completedSetService;
}
