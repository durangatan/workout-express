import { RoutineSetRepository, WorkoutSetRepository } from '../repositories';
import { RoutineSet } from '../models';

class RoutineSetService {
  constructor(routineSetRepository = RoutineSetRepository()) {
    this.routineSetRepository = routineSetRepository;
    this.saveMulti = this.saveMulti.bind(this);
    this.byRoutineId = this.byRoutineId.bind(this);
  }

  all() {
    return this.routineSetRepository.all();
  }

  saveMulti(routineSets) {
    return this.routineSetRepository.upsertMulti(routineSets);
  }
  byRoutineId(routineId) {
    return this.routineSetRepository
      .byRoutineId(routineId)
      .then(routineSets =>
        routineSets.map(routineSet => new RoutineSet(routineSet))
      );
  }
}

let routineSetService;
export default function() {
  if (!routineSetService) {
    routineSetService = new RoutineSetService();
  }
  return routineSetService;
}
