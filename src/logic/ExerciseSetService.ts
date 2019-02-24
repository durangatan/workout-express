import { GetExerciseSetRepository } from '../repositories';
import { ExerciseSetRepository } from '../repositories/ExerciseSetRepository';
import { ExerciseSet, ExerciseSetArguments, ExerciseSetId, WithId } from 'workout-models';

export class ExerciseSetService {
  exerciseSetRepository: ExerciseSetRepository;
  constructor(exerciseSetRepository = GetExerciseSetRepository()) {
    this.exerciseSetRepository = exerciseSetRepository;
  }

  byIdMulti(ExerciseSetIds: Array<ExerciseSetId>) {
    return this.exerciseSetRepository
      .byIdMulti(ExerciseSetIds)
      .then(ExerciseSets => ExerciseSets.map((exerciseSet: ExerciseSetArguments) => new ExerciseSet(exerciseSet)));
  }

  saveMulti(exerciseSets: Array<ExerciseSet & WithId<ExerciseSet>>) {
    return this.exerciseSetRepository.upsertMulti(exerciseSets);
  }
  createMulti(exerciseSets: Array<ExerciseSet>) {
    return this.exerciseSetRepository.insertMultiple(exerciseSets);
  }
}

let exerciseSetService: ExerciseSetService;
export function GetExerciseSetService() {
  if (!exerciseSetService) {
    exerciseSetService = new ExerciseSetService();
  }
  return exerciseSetService;
}
