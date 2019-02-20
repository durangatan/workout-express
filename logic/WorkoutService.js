import { WorkoutRepository, WorkoutRoutineRepository } from '../repositories';
import { CompletedSetService } from '../logic';
import { WorkoutIncompleteError } from '../errors';

class WorkoutService {
  constructor(
    workoutRepository = WorkoutRepository(),
    workoutRoutineRepository = WorkoutRoutineRepository(),
    completedSetService = CompletedSetService()
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

  save(workout) {
    const { startTime, endTime } = new Workout(workout);
    if (!(workout.routines && workout.routines.length)) {
      throw new WorkoutIncompleteError('This workout contains no routines');
    }
    if (!(workout.completedSets && workout.completedSets.length)) {
      throw new WorkoutIncompleteError('This workout contains no completed sets');
    }
    return this.workoutRepository
      .insert(workout)
      .then(([savedWorkout]) => {
        return this.workoutRoutineRepository.insert({ routineId: workout.routines[0].id, workoutId: savedWorkout.id });
      })
      .then(([workoutRoutine]) =>
        this.completedSetService.saveForWorkout(workout.completedSets, workoutRoutine.workoutId)
      );
  }
}

let workoutService;
export default function WorkoutService() {
  if (!workoutService) {
    workoutService = new WorkoutService();
  }
  return workoutService;
}
