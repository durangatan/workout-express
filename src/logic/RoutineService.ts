import { GetRoutineRepository } from '../repositories';
import { RoutineRepository } from '../repositories/RoutineRepository';
import { WorkoutSetService } from './WorkoutSetService';
import { RoutineSetService } from './RoutineSetService';
import { ExerciseService } from './ExerciseService';
import { GetWorkoutSetService, GetRoutineSetService, GetExerciseService } from '.';
import { Routine, WorkoutSet, RoutineSet, Exercise } from '../../../workout-models';
import { RoutineId } from '../../../workout-models/Routine';

export class RoutineService {
  routineRepository: RoutineRepository;
  workoutSetService: WorkoutSetService;
  routineSetService: RoutineSetService;
  exerciseService: ExerciseService;

  constructor(
    routineRepository = GetRoutineRepository(),
    workoutSetService = GetWorkoutSetService(),
    routineSetService = GetRoutineSetService(),
    exerciseService = GetExerciseService()
  ) {
    this.routineRepository = routineRepository;
    this.workoutSetService = workoutSetService;
    this.routineSetService = routineSetService;
    this.exerciseService = exerciseService;
  }
  // the body of this method belongs in a resolver
  getById(routineId: RoutineId) {
    let routineSets = [];
    let workoutSetMap = {};
    const routinePromise = this.routineRepository.byId(routineId).then(routines => new Routine(routines[0]));
    const setsPromise = this.routineSetService
      .byRoutineId(routineId)
      .then((routineSetRes: Array<RoutineSet>) => {
        routineSets = routineSetRes;
        const workoutSetIds = [...new Set(routineSetRes.map(_ => _.setId))];
        return this.workoutSetService.byIdMulti(workoutSetIds);
      })
      .then((workoutSets: Array<WorkoutSet>) => {
        workoutSets.forEach(workoutSet => {
          workoutSetMap[workoutSet.id] = workoutSet;
        });
        const exerciseIds = [...new Set(workoutSets.map(_ => _.exerciseId))];
        return this.exerciseService.byIdMulti(exerciseIds);
      })
      .then((exerciseModels: Array<Exercise>) => {
        let exerciseMap = {};
        exerciseModels.forEach(exercise => {
          exerciseMap[exercise.id] = exercise;
        });
        return routineSets.map(routineSet => {
          const relevantWorkoutSet = workoutSetMap[routineSet.setId];
          const relevantExercise = exerciseMap[relevantWorkoutSet.exerciseId];
          return new WorkoutSet({
            ...relevantWorkoutSet,
            exercise: relevantExercise,
            id: routineSet.id
          });
        });
      });
    return Promise.all([routinePromise, setsPromise])
      .then(([routine, sets]) => {
        return { ...routine, sets };
      })
  }
  all() {
    return this.routineRepository.all();
  }

  save({ routine, workoutSets, routineSets }) {
    return this.routineRepository
      .save(routine)
      .then(() => {
        return this.workoutSetService.saveMulti(workoutSets);
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
