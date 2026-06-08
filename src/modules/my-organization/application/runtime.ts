import { GetOrganizationInfoUseCase } from '@/modules/my-organization/application/use-cases/GetOrganizationInfoUseCase';
import { GetMyOrganizationProfileUseCase } from '@/modules/my-organization/application/use-cases/GetMyOrganizationProfileUseCase';
import { GetMyTeamUseCase } from '@/modules/my-organization/application/use-cases/GetMyTeamUseCase';
import { GetReportingManagerUseCase } from '@/modules/my-organization/application/use-cases/GetReportingManagerUseCase';
import { GetWorkLocationUseCase } from '@/modules/my-organization/application/use-cases/GetWorkLocationUseCase';
import { GetWorkModeUseCase } from '@/modules/my-organization/application/use-cases/GetWorkModeUseCase';
import { MyOrganizationRepositoryImpl } from '@/modules/my-organization/infrastructure/repositories/MyOrganizationRepositoryImpl';

const myOrganizationRepository = new MyOrganizationRepositoryImpl();

export const myOrganizationUseCases = {
  getMyOrganizationProfile: new GetMyOrganizationProfileUseCase(myOrganizationRepository),
  getOrganizationInfo: new GetOrganizationInfoUseCase(myOrganizationRepository),
  getMyTeam: new GetMyTeamUseCase(myOrganizationRepository),
  getReportingManager: new GetReportingManagerUseCase(myOrganizationRepository),
  getWorkLocation: new GetWorkLocationUseCase(myOrganizationRepository),
  getWorkMode: new GetWorkModeUseCase(myOrganizationRepository),
};
