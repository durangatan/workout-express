import express from 'express';
import {
	RoutineController,
	WorkoutController,
	ExerciseController
} from './controllers';

const app = express();
app.listen(process.env.PORT || 3001, () =>
	console.log(`Server listening at port ${process.env.PORT || 3000}.`)
);

// enable cors for now
app.use(function(_, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// logging middleware
app.use(function(req, res, next) {
	console.log(
		`ebc-workout-express:${req.method.toUpperCase()}:${req.originalUrl}`
	);
	next();
});

app.use('/routines', RoutineController);
app.use('/workouts', WorkoutController);
app.use('/exercises', ExerciseController);

app.get('/', function(req, res) {
	res.send('boo');
});
