import { ExerciseRepository } from '../repositories';

class ExerciseService {
  constructor(exerciseRepository = ExerciseRepository()) {
    this.exerciseRepository = exerciseRepository;
    this.all = this.all.bind(this);
  }

  all() {
    return this.exerciseRepository.all();
  }

  byIdMulti(exerciseIds) {
    return this.exerciseRepository.byIdMulti(exerciseIds);
  }
}

let exerciseService;
export default function() {
  if (!exerciseService) {
    exerciseService = new ExerciseService();
  }
  return exerciseService;
}
