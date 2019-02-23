import { GetWorkoutSetRepository } from '../repositories';
import { WorkoutSetRepository } from '../repositories/WorkoutSetRepository';
import { WorkoutSet } from '../../../workout-models';
import { WorkoutSetArguments } from '../../../workout-models/WorkoutSet';

export class WorkoutSetService {
  workoutSetRepository: WorkoutSetRepository;
  constructor(workoutSetRepository = GetWorkoutSetRepository()) {
    this.workoutSetRepository = workoutSetRepository;
  }

  byIdMulti(workoutSetIds) {
    return this.workoutSetRepository
      .byIdMulti(workoutSetIds)
      .then(workoutSets => workoutSets.map((workoutSet: WorkoutSetArguments) => new WorkoutSet(workoutSet)));
  }

  saveMulti(workoutSets) {
    return this.workoutSetRepository.upsertMulti(workoutSets);
  }
}

let workoutSetService;
export function GetWorkoutSetService() {
  if (!workoutSetService) {
    workoutSetService = new WorkoutSetService();
  }
  return workoutSetService;
}
