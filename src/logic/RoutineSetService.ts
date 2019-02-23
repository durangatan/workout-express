import { GetRoutineSetRepository } from '../repositories';
import { RoutineSetRepository } from 'src/repositories/RoutineSetRepository';
import { RoutineSet } from '../../../workout-models';
import { WithId } from '../../../workout-utils';

export class RoutineSetService {
  routineSetRepository: RoutineSetRepository;
  constructor(routineSetRepository = GetRoutineSetRepository()) {
    this.routineSetRepository = routineSetRepository;
    this.saveMulti = this.saveMulti.bind(this);
    this.byRoutineId = this.byRoutineId.bind(this);
  }

  all() {
    return this.routineSetRepository.all();
  }

  create(routineSetData: RoutineSet) {
    return this.routineSetRepository.insert(routineSetData);
  }

  save(routineSetData: RoutineSet & WithId<RoutineSet>) {
    return this.routineSetRepository.upsert(routineSetData);
  }

  saveMulti(routineSets) {
    return this.routineSetRepository.upsertMulti(routineSets);
  }
  byRoutineId(routineId) {
    return this.routineSetRepository
      .byRoutineId(routineId)
      .then(routineSets => routineSets.map(routineSet => new RoutineSet(routineSet)));
  }
}

let routineSetService: RoutineSetService;
export function GetRoutineSetService() {
  if (!routineSetService) {
    routineSetService = new RoutineSetService();
  }
  return routineSetService;
}
