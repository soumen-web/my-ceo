import { CreateHrQueryUseCase } from '@/modules/hr-query/application/use-cases/CreateHrQueryUseCase';
import { GetHrQueriesUseCase } from '@/modules/hr-query/application/use-cases/GetHrQueriesUseCase';
import { GetHrQueryByIdUseCase } from '@/modules/hr-query/application/use-cases/GetHrQueryByIdUseCase';
import { HrQueryRepositoryImpl } from '@/modules/hr-query/infrastructure/repositories/HrQueryRepositoryImpl';

const hrQueryRepository = new HrQueryRepositoryImpl();

export const hrQueryUseCases = {
  createQuery: new CreateHrQueryUseCase(hrQueryRepository),
  getQueryById: new GetHrQueryByIdUseCase(hrQueryRepository),
  getQueries: new GetHrQueriesUseCase(hrQueryRepository),
};
