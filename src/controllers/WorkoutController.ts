import express from 'express';
import bodyParser from 'body-parser';
import { WorkoutService as WorkoutServiceGetter } from '../logic';

const WorkoutController = express.Router();
const WorkoutService = WorkoutServiceGetter();
const jsonParser = bodyParser.json();

WorkoutController.post('/', jsonParser, (req, res, next) => {
  return WorkoutService.save(workout).then(() => {
    res.send(200);
  });
});

WorkoutController.get('/', (req, res, next) => {
  return WorkoutService.all().then(workouts => res.send(workouts));
});

export default WorkoutController;
