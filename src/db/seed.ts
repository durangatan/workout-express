/*
 * Seeds the database with a routine and all its dependencies.
 *
 */

import { Exercise, Routine, RoutineSet } from 'workout-models';
import { WorkoutSetArguments } from 'workout-models';
import { DatabaseConnection, dbConfig } from './';
import { GetExerciseService, GetRoutineService, GetRoutineSetService, GetWorkoutSetService } from '../logic';

const ExerciseService = GetExerciseService();
const RoutineService = GetRoutineService();
const RoutineSetService = GetRoutineSetService();
const WorkoutSetService = GetWorkoutSetService();

const exercises = [
  { name: 'Leg Press', machineId: '20', seatSetting: '3', rangeSetting: '4' },
  {
    name: 'Hip Abduction',
    machineId: '29',
    notes: 'Start with levers fully closed.'
  },
  {
    name: 'Hip Adduction',
    machineId: '30',
    notes: 'Open to slight stretch initially.'
  },
  {
    name: 'Chest Press',
    machineId: '10',
    seatSetting: '3',
    rangeSetting: '3'
  },
  {
    name: 'Row',
    machineId: '9',
    seatSetting: '5',
    rangeSetting: '3',
    notes: 'Ankles behind knees'
  },
  {
    name: 'Overhead Press',
    machineId: '12',
    seatSetting: '5',
    notes: 'Palms facing in'
  },
  { name: 'Pulldown', machineId: '11', notes: 'Set knee pads first' },
  {
    name: 'Tricep Extension',
    machineId: '13',
    notes: 'Elbows to pads after start.'
  },
  { name: 'Bicep Curl', machineId: '14', notes: 'Elbows to pads.' },
  {
    name: 'Abdominal Crunch',
    machineId: '',
    rangeSetting: '5',
    notes: 'Bellybutton to dot'
  },
  { name: 'Lateral Torso', seatSetting: '5', rangeSetting: '5' }
].map(exercise => new Exercise(exercise));

let sets: Array<WorkoutSetArguments> = [
  {
    exercise: new Exercise({ name: 'Leg Press' }),
    weight: 60,
    repetitions: 6,
    type: 'Warmup'
  },
  {
    exercise: new Exercise({ name: 'Leg Press' }),
    weight: 110,
    repetitions: 12
  },
  {
    exercise: new Exercise({ name: 'Hip Abduction' }),
    weight: 105,
    repetitions: 20
  },
  {
    exercise: new Exercise({ name: 'Hip Adduction' }),
    weight: 115,
    repetitions: 20
  },
  {
    exercise: new Exercise({ name: 'Chest Press' }),
    weight: 55,
    repetitions: 6,
    type: 'Warmup'
  },
  {
    exercise: new Exercise({ name: 'Chest Press' }),
    weight: 100,
    repetitions: 12
  },
  {
    exercise: new Exercise({ name: 'Row' }),
    weight: 70,
    repetitions: 6,
    type: 'Warmup'
  },
  { exercise: new Exercise({ name: 'Row' }), weight: 100, repetitions: 12 },
  {
    exercise: new Exercise({ name: 'Overhead Press' }),
    weight: 80,
    repetitions: 12
  },
  {
    exercise: new Exercise({ name: 'Pulldown' }),
    weight: 90,
    repetitions: 12
  },
  {
    exercise: new Exercise({ name: 'Tricep Extension' }),
    weight: 60,
    repetitions: 12
  },
  {
    exercise: new Exercise({ name: 'Bicep Curl' }),
    weight: 65,
    repetitions: 12
  },
  {
    exercise: new Exercise({ name: 'Abdominal Crunch' }),
    weight: 95,
    repetitions: 20
  },
  {
    exercise: new Exercise({ name: 'Lateral Torso' }),
    weight: 90,
    repetitions: 20
  }
];

export default async function seed() {
  const db = new DatabaseConnection(dbConfig);
  let joeRoutine = new Routine({ name: `Joe's East Bank Club Routine` });
  const routine: Routine = await RoutineService.save({ routine: joeRoutine, workoutSets: [], routineSets: [] });
  const newExercises = await ExerciseService.saveMulti(exercises);
  const newSets = sets.map(set => {
    set.exerciseId = newExercises.find(exercise => exercise.name === set.exercise.name).id;
    return set;
  });
  const allSets = await WorkoutSetService.saveMulti(newSets);
  let ordering = 0;
  await allSets.forEach(async set => {
    if (set.type === 'Warmup') {
      await RoutineSetService.create(
        new RoutineSet({
          routineId: routine.id,
          setId: set.id,
          ordering
        })
      );
      ordering++;
    } else {
      for (var i = 0; i < 3; i++) {
        RoutineSetService.create(
          new RoutineSet({
            routineId: routine.id,
            setId: set.id,
            ordering
          })
        );
        ordering++;
      }
    }
  });
  return RoutineSetService.all();
}
seed()
  .then(() => {
    console.log('🌱 Enjoy!');
    process.exit();
  })
  .catch(err => {
    console.log("hmm...something went wrong... maybe you've already seeded?");
    process.exit(1);
  });
