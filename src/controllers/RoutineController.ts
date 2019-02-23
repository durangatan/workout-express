import express from 'express';
import { GetRoutineService } from '../logic';
import { Routine, WorkoutSet, RoutineSet } from '../../../workout-models';
import bodyParser from 'body-parser';
const RoutineController = express.Router();
const RoutineService = GetRoutineService();
const jsonParser = bodyParser.json();

RoutineController.get('/', (req, res, next) => {
  return RoutineService.all().then(routines => {
    res.send(routines);
  });
});

// get a routine by id
RoutineController.get('/:id', (req, res, next) => {
  return RoutineService.getById(Routine.createId(Number(req.params.id))).then(routine => {
    res.send(routine);
  });
});

RoutineController.post('/', jsonParser, (req, res, next) => {
  const { routine, workoutSets, routineSets } = req.body;
  return RoutineService.save({
    routine: new Routine(routine),
    workoutSets: workoutSets.map(workoutSet => new WorkoutSet(workoutSet)),
    routineSets: routineSets.map(routineSet => new RoutineSet(routineSet))
  }).then(() => {
    res.send(200);
  });
});

export default RoutineController;
