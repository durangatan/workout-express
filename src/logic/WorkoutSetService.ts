import { WorkoutSetRepository } from '../repositories';
import { WorkoutSet } from '../../../workout-models';

export class WorkoutSetService {
  workoutSetRepository: WorkoutSetRepository;
  constructor(workoutSetRepository = WorkoutSetRepository()) {
    this.workoutSetRepository = workoutSetRepository;
  }

  byIdMulti(workoutSetIds) {
    return this.workoutSetRepository
      .byIdMulti(workoutSetIds)
      .then(workoutSets => workoutSets.map(workoutSet => new WorkoutSet(workoutSet)));
  }

  saveMulti(workoutSets) {
    return this.workoutSetRepository.upsertMulti(workoutSets);
  }
}

let workoutSetService;
export default function() {
  if (!workoutSetService) {
    workoutSetService = new WorkoutSetService();
  }
  return workoutSetService;
}
