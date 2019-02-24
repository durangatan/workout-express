import { GetExerciseRepository } from '../repositories';
import { ExerciseRepository } from '../repositories/ExerciseRepository';
import { Exercise, WithId, ExerciseId } from 'workout-models';

export class ExerciseService {
  exerciseRepository: ExerciseRepository;
  constructor(exerciseRepository = GetExerciseRepository()) {
    this.exerciseRepository = exerciseRepository;
  }

  all() {
    return this.exerciseRepository.all();
  }

  byIdMulti(exerciseIds: Array<ExerciseId>) {
    return this.exerciseRepository.byIdMulti(exerciseIds);
  }

  createMulti(exercises: Array<Exercise>) {
    return this.exerciseRepository.insertMultiple(exercises);
  }

  saveMulti(exercises: Array<Exercise & WithId<Exercise>>) {
    return this.exerciseRepository.upsertMulti(exercises);
  }
}

let exerciseService: ExerciseService;
export function GetExerciseService() {
  if (!exerciseService) {
    exerciseService = new ExerciseService();
  }
  return exerciseService;
}
