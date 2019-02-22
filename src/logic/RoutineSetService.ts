import { GetRoutineSetRepository } from '../repositories';
import { RoutineSetRepository } from 'src/repositories/RoutineSetRepository';
import { RoutineSet, RoutineSetArguments } from '../../../workout-models';

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

	save(routineSetData: RoutineSet | RoutineSetArguments) {
		return this.routineSetRepository.upsert(
			RoutineSet.ensure(routineSetData)
		);
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

let routineSetService: RoutineSetService;
export function GetRoutineSetService() {
	if (!routineSetService) {
		routineSetService = new RoutineSetService();
	}
	return routineSetService;
}
