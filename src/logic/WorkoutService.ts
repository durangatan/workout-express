import { GetWorkoutRepository, GetWorkoutRoutineRepository } from '../repositories';
import { GetCompletedSetService } from '../logic';
import { WorkoutIncompleteError } from '../errors';
import { WorkoutRepository } from 'src/repositories/WorkoutRepository';
import { WorkoutRoutineRepository } from 'src/repositories/WorkoutRoutineRepository';
import { Workout, WorkoutRoutine, WorkoutArguments, CompletedSet, WithId } from 'workout-models';
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
    this.all = this.all.bind(this);
    this.save = this.save.bind(this);
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
    // routine set ids by workout id
    const completedSetMap = {};
    // exerciseSetIds by routineSet
    const routineSetMap = {};
    const exerciseSetIds = [];
    flatCompleteSets.forEach((completedSet: CompletedSet & WithId<CompletedSet>) => {
      console.log(completedSet);
      if (completedSetMap[completedSet.workoutId]) {
        completedSetMap[completedSet.workoutId].push(completedSet.exerciseSetId);
      } else {
        completedSetMap[completedSet.workoutId] = [completedSet.exerciseSetId];
      }
      exerciseSetIds.push(completedSet.exerciseSetId);
    });
    const completedRoutineSets = await this.routineSetService.byIdMulti(exerciseSetIds);
    console.log(completedRoutineSets, 'completedRoutineSets');
    completedRoutineSets.forEach(routineSet => {
      routineSetMap[routineSet.id] = routineSet.exerciseSetId;
    });
    return Promise.all(
      allWorkouts.map(async workout => {
        if (completedSetMap[workout.id] && completedSetMap[workout.id].length) {
          const pertinentSets = completedSetMap[workout.id].flatMap(exerciseSetId => {
            if (routineSetMap[exerciseSetId]) {
              return [routineSetMap[exerciseSetId]];
            } else {
              return [];
            }
          });
          if (pertinentSets.length) {
            const resolvedSets = await this.exerciseSetService.byIdMulti(pertinentSets);
            workout.completedExerciseSets = resolvedSets.flat();
          }
          return [workout];
        }
        return Promise.resolve([]);
      })
    ).then(resolvedWorkouts => resolvedWorkouts.flat());
  }

  async save(workout: Workout) {
    const [savedWorkout]: Array<Workout> = await this.workoutRepository.insert(workout);
    await this.workoutRoutineRepository.insert(
      new WorkoutRoutine({
        routineId: workout.routines[0].id,
        workoutId: savedWorkout.id
      })
    );
    await this.completedSetService.saveForWorkout(workout);
  }
}

let workoutService: WorkoutService;
export function GetWorkoutService() {
  if (!workoutService) {
    workoutService = new WorkoutService();
  }
  return workoutService;
}
