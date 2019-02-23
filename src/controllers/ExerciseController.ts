import express from 'express';
import { GetExerciseService } from '../logic';

const ExerciseController = express.Router();
const ExerciseService = GetExerciseService();
// const jsonParser = bodyParser.json();
ExerciseController.get('/', (_req, res) => {
	return ExerciseService.all().then(Exercises => res.send(Exercises));
});

// ExerciseController.post('/', jsonParser, (req, res) => {
// 	return ExerciseService.save(req.body).then(() => {
// 		res.send(200);
// 	});
// });

export default ExerciseController;
