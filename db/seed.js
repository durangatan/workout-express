import { Exercise, WorkoutSet, Routine, RoutineSet } from '../models';
import { DatabaseConnector, dbConfig } from './';

const exercises = [
  { name: 'Leg Press', machineId: '20', seatSetting: '3', rangeSetting: '4' },
  { name: 'Hip Abduction', machineId: '29', notes: 'Start with levers fully closed.' },
  { name: 'Hip Adduction', machineId: '30', notes: 'Open to slight stretch initially.' },
  { name: 'Chest Press', machineId: '10', seatSetting: '3', rangeSetting: '3' },
  { name: 'Row', machineId: '9', seatSetting: '5', rangeSetting: '3', notes: 'Ankles behind knees' },
  { name: 'Overhead Press', machineId: '12', seatSetting: '5', notes: 'Palms facing in' },
  { name: 'Pulldown', machineId: '11', notes: 'Set knee pads first' },
  { name: 'Tricep Extension', machineId: '13', notes: 'Elbows to pads after start.' },
  { name: 'Bicep Curl', machineId: '14', notes: 'Elbows to pads.' },
  { name: 'Abdominal Crunch', machineId: '', rangeSetting: '5', notes: 'Bellybutton to dot' },
  { name: 'Lateral Torso', seatSetting: '5', rangeSetting: '5' }
].map(exercise => new Exercise(exercise));

let sets = [
  { exercise: { name: 'Leg Press' }, weight: 60, repetitions: 6, type: 'Warmup' },
  { exercise: { name: 'Leg Press' }, weight: 110, repetitions: 12 },
  { exercise: { name: 'Hip Abduction' }, weight: 105, repetitions: 20 },
  { exercise: { name: 'Hip Adduction' }, weight: 115, repetitions: 20 },
  { exercise: { name: 'Chest Press' }, weight: 55, repetitions: 6, type: 'Warmup' },
  { exercise: { name: 'Chest Press' }, weight: 100, repetitions: 12 },
  { exercise: { name: 'Row' }, weight: 70, repetitions: 6, type: 'Warmup' },
  { exercise: { name: 'Row' }, weight: 100, repetitions: 12 },
  { exercise: { name: 'Overhead Press' }, weight: 80, repetitions: 12 },
  { exercise: { name: 'Pulldown' }, weight: 90, repetitions: 12 },
  { exercise: { name: 'Tricep Extension' }, weight: 60, repetitions: 12 },
  { exercise: { name: 'Bicep Curl' }, weight: 65, repetitions: 12 },
  { exercise: { name: 'Abdominal Crunch' }, weight: 95, repetitions: 20 },
  { exercise: { name: 'Lateral Torso' }, weight: 90, repetitions: 20 }
];

export default function seed() {
  const db = new DatabaseConnector(dbConfig);
  let joeRoutine = new Routine({ name: `Joe's East Bank Club Routine` });
  return db
    .then(() => Promise.all(exercises.map(exercise => db.query(exercise.insertInto('exercises')))))
    .then(() => db.query('SELECT * FROM exercises;'))
    .then(newExercises => {
      return Promise.all(
        sets.map(set => {
          set.exerciseId = newExercises.flat().find(exercise => exercise.name === set.exercise.name).id;
          return db.query(new WorkoutSet(set).insertInto('workout_sets'));
        })
      );
    })
    .then(() => db.query('SELECT * from workout_sets;'))
    .then(allSets => {
      sets = allSets;
      return db.query(joeRoutine.insertInto('routines'));
    })
    .then(okPacket => {
      let ordering = 0;
      let promises = [];
      sets.forEach(set => {
        if (set.type === 'Warmup') {
          promises.push(
            db.query(
              new RoutineSet({ routineId: okPacket.insertId, setId: set.id, ordering }).insertInto('routine_sets')
            )
          );
          ordering++;
        } else {
          for (var i = 0; i < 3; i++) {
            promises.push(
              db.query(
                new RoutineSet({ routineId: okPacket.insertId, setId: set.id, ordering }).insertInto('routine_sets')
              )
            );
            ordering++;
          }
        }
        return Promise.all(promises);
      });
    });
}
