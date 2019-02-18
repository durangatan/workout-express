import express from 'express';
import bodyParser from 'body-parser';
import { RoutineService, WorkoutService } from './logic';
import seed from './db/seed';
import { Workout } from './models';
const app = express();
app.listen(3001, () => console.log('Server listening at port 3001.'));
// app.use(bodyParser.json);
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

app.get('/', function(req, res) {
  res.send('boo');
});
// app.get('/exercises', () => {});

app.get('/routines', (req, res, next) => {
  return RoutineService()
    .all()
    .then(routines => {
      res.send(routines);
    });
});

// get a routine by id
app.get('/routines/:id', (req, res, next) => {
  return RoutineService()
    .getById(req.params.id)
    .then(routine => {
      res.send(routine);
    });
});

app.post('/workouts', jsonParser, (req, res, next) => {
  const workout = new Workout(req.body);
  return WorkoutService()
    .save(workout)
    .then(() => {
      res.send(200);
    });
});

app.get('/seed', (req, res, next) => {
  return seed().then(_ => {
    res.send('seeded');
  });
});

// // post a new routine
// app.post('/routine');

// app.get('/workouts');
