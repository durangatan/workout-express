import express from 'express';
import bodyParser from 'body-parser';
import { GetWorkoutService } from '../logic';

const WorkoutController = express.Router();
const WorkoutService = GetWorkoutService();
const jsonParser = bodyParser.json();

WorkoutController.post('/', jsonParser, (req, res, next) => {
  return WorkoutService.save(req.body).then(() => {
    res.send(200);
  });
});

WorkoutController.get('/', async (req, res, next) => {
  try {
    const workouts = await WorkoutService.allWithCompletedSets();
    console.log(workouts);
    res.send(workouts);
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

export default WorkoutController;
