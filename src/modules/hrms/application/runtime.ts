import { GetHrmsSelfServiceSnapshotUseCase } from '@/modules/hrms/application/use-cases/GetHrmsSelfServiceSnapshotUseCase';
import { HrmsSelfServiceRepositoryImpl } from '@/modules/hrms/infrastructure/repositories/HrmsSelfServiceRepositoryImpl';

const hrmsSelfServiceRepository = new HrmsSelfServiceRepositoryImpl();

export const hrmsUseCases = {
  getSelfServiceSnapshot: new GetHrmsSelfServiceSnapshotUseCase(hrmsSelfServiceRepository),
};
