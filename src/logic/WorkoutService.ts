import { GetWorkoutRepository, GetWorkoutRoutineRepository } from '../repositories';
import { GetCompletedSetService } from '../logic';
import { WorkoutIncompleteError } from '../errors';
import { WorkoutRepository } from 'src/repositories/WorkoutRepository';
import { WorkoutRoutineRepository } from 'src/repositories/WorkoutRoutineRepository';
import {
  Workout,
  WorkoutRoutine,
  WorkoutArguments,
  CompletedSet,
  WithId,
  ExerciseSet,
  ExerciseSetId
} from 'workout-models';
import { CompletedSetService } from './CompletedSetService';
import { ExerciseSetService, GetExerciseSetService } from './ExerciseSetService';
import { RoutineSetService, GetRoutineSetService } from './RoutineSetService';
export class WorkoutService {
  workoutRepository: WorkoutRepository;
  workoutRoutineRepository: WorkoutRoutineRepository;
  completedSetService: CompletedSetService;
  routineSetService: RoutineSetService;
  exerciseSetService: ExerciseSetService;
  constructor(
    workoutRepository = GetWorkoutRepository(),
    workoutRoutineRepository = GetWorkoutRoutineRepository(),
    completedSetService = GetCompletedSetService(),
    routineSetService = GetRoutineSetService(),
    exerciseSetService = GetExerciseSetService()
  ) {
    this.workoutRepository = workoutRepository;
    this.workoutRoutineRepository = workoutRoutineRepository;
    this.completedSetService = completedSetService;
    this.routineSetService = routineSetService;
    this.exerciseSetService = exerciseSetService;
  }
  async all() {
    return await this.workoutRepository.all();
  }

  async allWithCompletedSets() {
    const allWorkouts = await this.all();
    const completedSetPromises = allWorkouts.map(workout => this.completedSetService.byWorkoutId(workout.id));

    const completedSets: Array<Array<CompletedSet & WithId<CompletedSet>>> = await Promise.all(completedSetPromises);
    const flatCompleteSets = completedSets.flat();
    if (!flatCompleteSets.length) {
      return Promise.reject(new WorkoutIncompleteError('no completed sets for any workouts'));
    }
    // exerciseSet ids by workout id
    const completedSetMap = {};
    const exerciseSetIds = [];
    flatCompleteSets.forEach((completedSet: CompletedSet & WithId<CompletedSet>) => {
      if (completedSetMap[completedSet.workoutId]) {
        completedSetMap[completedSet.workoutId].push(completedSet.exerciseSetId);
      } else {
        completedSetMap[completedSet.workoutId] = [completedSet.exerciseSetId];
      }
      exerciseSetIds.push(completedSet.exerciseSetId);
    });
    return Promise.all(
      allWorkouts.map(async workout => {
        const pertinentExerciseSetIds = completedSetMap[workout.id];
        if (pertinentExerciseSetIds && pertinentExerciseSetIds.length) {
          const resolvedExerciseSets = await this.exerciseSetService.byIdMulti(pertinentExerciseSetIds);
          const resolvedExerciseSetMap = {};
          resolvedExerciseSets.forEach((exerciseSet: ExerciseSet & WithId<ExerciseSet>) => {
            resolvedExerciseSetMap[exerciseSet.id] = exerciseSet;
          });
          workout.completedExerciseSets = pertinentExerciseSetIds.map(
            (workoutSetId: ExerciseSetId) => resolvedExerciseSetMap[workoutSetId]
          );
          return [workout];
        }
        return Promise.resolve([]);
      })
    ).then(resolvedWorkouts => resolvedWorkouts.flat());
  }

  async create(workout: Workout) {
    const [savedWorkout]: Array<Workout> = await this.workoutRepository.insert(workout);
    await this.workoutRoutineRepository.insert(
      new WorkoutRoutine({
        routineId: workout.routines[0].id,
        workoutId: savedWorkout.id
      })
    );
    await this.completedSetService.saveForWorkout(workout.completedExerciseSets, savedWorkout.id);
  }
}

let workoutService: WorkoutService;
export function GetWorkoutService() {
  if (!workoutService) {
    workoutService = new WorkoutService();
  }
  return workoutService;
}
