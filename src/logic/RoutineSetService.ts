import { GetRoutineSetRepository } from '../repositories';
import { RoutineSetRepository } from 'src/repositories/RoutineSetRepository';
import { RoutineSet, WithId, RoutineSetId } from 'workout-models';

export class RoutineSetService {
  routineSetRepository: RoutineSetRepository;
  constructor(routineSetRepository = GetRoutineSetRepository()) {
    this.routineSetRepository = routineSetRepository;
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
    return this.routineSetRepository.byRoutineId(routineId);
  }
  byIdMulti(routineSetIds: Array<RoutineSetId>) {
    return this.routineSetRepository.byIdMulti(routineSetIds);
  }
}

let routineSetService: RoutineSetService;
export function GetRoutineSetService() {
  if (!routineSetService) {
    routineSetService = new RoutineSetService();
  }
  return routineSetService;
}
