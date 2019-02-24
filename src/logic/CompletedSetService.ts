import { GetCompletedSetRepository } from '../repositories';
import { CompletedSetRepository } from '../repositories/CompletedSetRepository';
import { CompletedSet, CompletedSetId, ExerciseSet, WorkoutId, Workout, Id } from 'workout-models';
import { WorkoutIncompleteError, NoIdError } from '../errors';

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
  createMulti(completedSets: Array<CompletedSet>) {
    return this.completedSetRepository.insertMultiple(completedSets);
  }

  saveForWorkout(completedExerciseSets: Array<ExerciseSet>, workoutId: WorkoutId) {
    if (!completedExerciseSets || !completedExerciseSets.length) {
      return Promise.reject(new WorkoutIncompleteError('no completed sets for this workout'));
    }
    if (!workoutId) {
      return Promise.reject(new NoIdError('no Workout Id for these completedSets'));
    }
    const completedSets = completedExerciseSets.map(
      (exerciseSet: ExerciseSet) => new CompletedSet({ exerciseSetId: exerciseSet.id, workoutId })
    );
    this.completedSetRepository.insertMultiple(completedSets);
  }

  byWorkoutId(workoutId: WorkoutId) {
    return this.completedSetRepository.byWorkoutId(workoutId);
  }
}

let completedSetService: CompletedSetService;
export function GetCompletedSetService() {
  if (!completedSetService) {
    completedSetService = new CompletedSetService();
  }
  return completedSetService;
}
