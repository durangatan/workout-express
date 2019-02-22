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

WorkoutController.get('/', (req, res, next) => {
	return WorkoutService.all().then(workouts => res.send(workouts));
});

export default WorkoutController;
