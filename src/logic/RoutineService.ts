import { GetRoutineRepository } from '../repositories';
import { RoutineRepository } from '../repositories/RoutineRepository';
import { ExerciseSetService } from './ExerciseSetService';
import { RoutineSetService } from './RoutineSetService';
import { ExerciseService } from './ExerciseService';
import { GetExerciseSetService, GetRoutineSetService, GetExerciseService } from '.';
import { Routine, ExerciseSet, RoutineSet, Exercise, RoutineId } from 'workout-models';

export class RoutineService {
  routineRepository: RoutineRepository;
  exerciseSetService: ExerciseSetService;
  routineSetService: RoutineSetService;
  exerciseService: ExerciseService;

  constructor(
    routineRepository = GetRoutineRepository(),
    exerciseSetService = GetExerciseSetService(),
    routineSetService = GetRoutineSetService(),
    exerciseService = GetExerciseService()
  ) {
    this.routineRepository = routineRepository;
    this.exerciseSetService = exerciseSetService;
    this.routineSetService = routineSetService;
    this.exerciseService = exerciseService;
  }
  getById(routineId: RoutineId) {
    let routineSets = [];
    let exerciseSetMap = {};
    const routinePromise = this.routineRepository.byId(routineId).then(routines => new Routine(routines[0]));
    const setsPromise = this.routineSetService
      .byRoutineId(routineId)
      .then((routineSetRes: Array<RoutineSet>) => {
        routineSets = routineSetRes;
        const exerciseSetIds = [...new Set(routineSetRes.map(_ => _.exerciseSetId))];
        return this.exerciseSetService.byIdMulti(exerciseSetIds);
      })
      .then((exerciseSets: Array<ExerciseSet>) => {
        exerciseSets.forEach(exerciseSet => {
          exerciseSetMap[exerciseSet.id] = exerciseSet;
        });
        const exerciseIds = [...new Set(exerciseSets.map(_ => _.exerciseId))];
        return this.exerciseService.byIdMulti(exerciseIds);
      })
      .then((exerciseModels: Array<Exercise>) => {
        let exerciseMap = {};
        exerciseModels.forEach(exercise => {
          exerciseMap[exercise.id] = exercise;
        });
        return routineSets.map(routineSet => {
          const relevantExerciseSet = exerciseSetMap[routineSet.setId];
          const relevantExercise = exerciseMap[relevantExerciseSet.exerciseId];
          return new ExerciseSet({
            ...relevantExerciseSet,
            exercise: relevantExercise
          });
        });
      });
    return Promise.all([routinePromise, setsPromise]).then(([routine, sets]) => {
      return { ...routine, sets };
    });
  }
  all() {
    return this.routineRepository.all();
  }

  create(routine: Routine) {
    return this.routineRepository.insert(routine);
  }

  save({ routine, exerciseSets, routineSets }) {
    return this.routineRepository
      .upsert(routine)
      .then(() => {
        return this.exerciseSetService.saveMulti(exerciseSets);
      })
      .then(() => {
        return this.routineSetService.saveMulti(routineSets);
      });
  }
}

let routineService: RoutineService;
export function GetRoutineService() {
  if (!routineService) {
    routineService = new RoutineService();
  }
  return routineService;
}
