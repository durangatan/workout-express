import express from 'express';
import bodyParser from 'body-parser';
import { RoutineService } from './logic';
import seed from './db/seed';
const app = express();
app.listen(3001, () => console.log('Server listening at port 3001.'));
// app.use(bodyParser.json);

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

app.get('/seed', (req, res, next) => {
  return seed().then(_ => {
    res.send('seeded');
  });
});

// // post a new routine
// app.post('/routine');

// app.post('/workout');

// app.get('/workouts');
