import { RoutineSetRepository, WorkoutSetRepository } from '../repositories';
import { RoutineSet, WorkoutSet } from '../models';

class WorkoutSetService {
  constructor(workoutSetRepository = WorkoutSetRepository()) {
    this.workoutSetRepository = workoutSetRepository;
    this.saveMulti = this.saveMulti.bind(this);
    this.byIdMulti = this.byIdMulti.bind(this);
  }

  byIdMulti(workoutSetIds) {
    return this.workoutSetRepository
      .byIdMulti(workoutSetIds)
      .then(workoutSets =>
        workoutSets.map(workoutSet => new WorkoutSet(workoutSet))
      );
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
