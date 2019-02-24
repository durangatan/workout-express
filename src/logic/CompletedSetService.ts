import { GetCompletedSetRepository } from '../repositories';
import { CompletedSetRepository } from '../repositories/CompletedSetRepository';
import { CompletedSet, CompletedSetId, ExerciseSet, WorkoutId, Workout } from 'workout-models';
import { WorkoutIncompleteError } from 'src/errors';

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

  saveForWorkout(workout: Workout) {
    if (!workout.completedExerciseSets || !workout.completedExerciseSets.length) {
      return Promise.reject(new WorkoutIncompleteError('no completed sets for this workout'));
    }
    const completedExerciseSets = workout.completedExerciseSets.map(
      (exerciseSet: ExerciseSet) => new CompletedSet({ exerciseSetId: exerciseSet.id, workoutId: workout.id })
    );
    this.completedSetRepository.insertMultiple(completedExerciseSets);
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
