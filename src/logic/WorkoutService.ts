import { GetWorkoutRepository, GetWorkoutRoutineRepository } from '../repositories';
import { GetCompletedSetService } from '../logic';
import { WorkoutIncompleteError } from '../errors';
import { WorkoutRepository } from 'src/repositories/WorkoutRepository';
import { WorkoutRoutineRepository } from 'src/repositories/WorkoutRoutineRepository';
import { Workout, WorkoutRoutine, WorkoutArguments } from 'workout-models';
import { CompletedSetService } from './CompletedSetService';

export class WorkoutService {
  workoutRepository: WorkoutRepository;
  workoutRoutineRepository: WorkoutRoutineRepository;
  completedSetService: CompletedSetService;
  constructor(
    workoutRepository = GetWorkoutRepository(),
    workoutRoutineRepository = GetWorkoutRoutineRepository(),
    completedSetService = GetCompletedSetService()
  ) {
    this.workoutRepository = workoutRepository;
    this.workoutRoutineRepository = workoutRoutineRepository;
    this.completedSetService = completedSetService;
    this.all = this.all.bind(this);
    this.save = this.save.bind(this);
  }
  all() {
    return this.workoutRepository.all();
  }

  save(workout: WorkoutArguments) {
    const workoutModel = new Workout(workout);
    if (!(workout.routines && workout.routines.length)) {
      throw new WorkoutIncompleteError('This workout contains no routines');
    }
    if (!(workout.completedSets && workout.completedSets.length)) {
      throw new WorkoutIncompleteError('This workout contains no completed sets');
    }
    return this.workoutRepository.insert(workoutModel).then(([savedWorkout]) => {
      return this.workoutRoutineRepository.insert(
        new WorkoutRoutine({
          routineId: workoutModel.routines[0].id,
          workoutId: savedWorkout.id
        })
      );
    });
    /// move completed set code to completed set service!
  }
}

let workoutService: WorkoutService;
export function GetWorkoutService() {
  if (!workoutService) {
    workoutService = new WorkoutService();
  }
  return workoutService;
}
