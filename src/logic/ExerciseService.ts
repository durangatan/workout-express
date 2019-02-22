import { GetExerciseRepository } from '../repositories';
import { ExerciseRepository } from '../repositories/ExerciseRepository';

export class ExerciseService {
  exerciseRepository: ExerciseRepository;
  constructor(exerciseRepository = GetExerciseRepository()) {
    this.exerciseRepository = exerciseRepository;
  }

  all() {
    return this.exerciseRepository.all();
  }

  byIdMulti(exerciseIds) {
    return this.exerciseRepository.byIdMulti(exerciseIds);
  }
}

let exerciseService: ExerciseService;
export function GetExerciseService() {
  if (!exerciseService) {
    exerciseService = new ExerciseService();
  }
  return exerciseService;
}
