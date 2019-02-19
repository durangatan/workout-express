import express from 'express';
import bodyParser from 'body-parser';
import { WorkoutService, ExerciseService } from './logic';
import { RoutineController } from './controllers';
import { Workout } from './models';
const app = express();
app.listen(3001, () => console.log('Server listening at port 3001.'));
const jsonParser = bodyParser.json();

// enable cors for now
app.use(function(req, res, next) {
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

app.get('/', function(req, res) {
  res.send('boo');
});
// app.get('/exercises', () => {});

app.post('/workouts', jsonParser, (req, res, next) => {
  const workout = new Workout(req.body);
  return WorkoutService()
    .save(workout)
    .then(() => {
      res.send(200);
    });
});

app.get('/exercises', (req, res, next) => {
  return ExerciseService()
    .all()
    .then(exercises => {
      res.send(exercises);
    });
});
