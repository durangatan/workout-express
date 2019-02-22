import express from 'express';
import { RoutineController, WorkoutController } from './controllers';
import { GetExerciseService } from './logic';

const app = express();
app.listen(3001, () => console.log('Server listening at port 3001.'));

// enable cors for now
app.use(function(_, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// logging middleware
app.use(function(req, res, next) {
  console.log(`ebc-workout-express:${req.method.toUpperCase()}:${req.originalUrl}`);
  next();
});

app.use('/routines', RoutineController);
app.use('/workouts', WorkoutController);

app.get('/', function(req, res) {
  res.send('boo');
});

app.get('/exercises', (_req, res, next) => GetExerciseService()
  .all()
  .then(exercises => {
    res.send(exercises);
  }));
