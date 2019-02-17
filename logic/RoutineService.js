import { RoutineRepository } from '../repositories';

class RoutineService {
  constructor(routineRepository = RoutineRepository()) {
    this.routineRepository = routineRepository;
    this.getById = this.getById.bind(this);
  }
  getById(id) {
    return this.routineRepository.byId(id);
  }
  all() {
    return this.routineRepository.all();
  }
}

let routineService;
export default function RoutineService() {
  if (!routineService) {
    routineService = new RoutineService();
  }
  return routineService;
}
