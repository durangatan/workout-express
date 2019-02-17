import { DatabaseConnector, dbConfig } from '../db';
import { Routine, RoutineSet, WorkoutSet } from '../models';
import { ExerciseRepository } from './';
class SetRepository {
  constructor(databaseConnector = new DatabaseConnector(dbConfig), exerciseRepository = ExerciseRepository()) {
    this.db = databaseConnector;
    this.exerciseRepository = exerciseRepository;
  }
  forRoutine(routineId) {
    let routineSets = [];
    let workoutSetMap = {};
    return this.db
      .query(`SELECT * FROM routine_sets WHERE routineId =${routineId}`)
      .then(routineSetRes => {
        routineSets = routineSetRes.map(routineSet => new RoutineSet(routineSet));
        const workoutSetIds = [...new Set(routineSets.map(_ => _.setId))];
        return this.db.query(`SELECT * FROM workout_sets WHERE id IN (${workoutSetIds.join()})`);
      })
      .then(workoutSets => {
        const workoutSetModels = workoutSets.map(set => {
          const workoutSet = new WorkoutSet(set);
          workoutSetMap[workoutSet.id] = workoutSet;
          return workoutSet;
        });
        const exerciseIds = [...new Set(workoutSetModels.map(_ => _.exerciseId))];
        return this.exerciseRepository.byIdMulti(exerciseIds);
      })
      .then(exerciseModels => {
        let exerciseMap = {};
        exerciseModels.forEach(exercise => {
          exerciseMap[exercise.id] = exercise;
        });
        return routineSets.map(routineSet => {
          const relevantWorkoutSet = workoutSetMap[routineSet.setId];
          const relevantExercise = exerciseMap[relevantWorkoutSet.exerciseId];
          return new WorkoutSet({ ...relevantWorkoutSet, exercise: relevantExercise });
        });
      });
  }
}

let setRepository;

export default function SetRepository() {
  if (!setRepository) {
    setRepository = new SetRepository();
  }
  return setRepository;
}
