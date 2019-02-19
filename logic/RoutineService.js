import { RoutineRepository } from '../repositories';
import { WorkoutSet, Routine } from '../models';
import { WorkoutSetService, RoutineSetService, ExerciseService } from './';
class RoutineService {
  constructor(
    routineRepository = RoutineRepository(),
    workoutSetService = WorkoutSetService(),
    routineSetService = RoutineSetService(),
    exerciseService = ExerciseService()
  ) {
    this.routineRepository = routineRepository;
    this.workoutSetService = workoutSetService;
    this.routineSetService = routineSetService;
    this.exerciseService = exerciseService;
    this.getById = this.getById.bind(this);
  }
  getById(routineId) {
    let routineSets = [];
    let workoutSetMap = {};
    const routinePromise = this.routineRepository.byId(routineId).then(routines => new Routine(routines[0]));
    const setsPromise = this.routineSetService
      .byRoutineId(routineId)
      .then(routineSetRes => {
        routineSets = routineSetRes;
        const workoutSetIds = [...new Set(routineSetRes.map(_ => _.setId))];
        return this.workoutSetService.byIdMulti(workoutSetIds);
      })
      .then(workoutSets => {
        workoutSets.forEach(workoutSet => {
          workoutSetMap[workoutSet.id] = workoutSet;
        });
        const exerciseIds = [...new Set(workoutSets.map(_ => _.exerciseId))];
        return this.exerciseService.byIdMulti(exerciseIds);
      })
      .then(exerciseModels => {
        let exerciseMap = {};
        exerciseModels.forEach(exercise => {
          exerciseMap[exercise.id] = exercise;
        });
        return routineSets.map(routineSet => {
          const relevantWorkoutSet = workoutSetMap[routineSet.setId];
          const relevantExercise = exerciseMap[relevantWorkoutSet.exerciseId];
          return new WorkoutSet({ ...relevantWorkoutSet, exercise: relevantExercise, id: routineSet.id });
        });
      });
    return Promise.all([routinePromise, setsPromise]).then(([routine, sets]) => {
      return { ...routine, sets };
    });
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

let routineService;
export default function RoutineService() {
  if (!routineService) {
    routineService = new RoutineService();
  }
  return routineService;
}
