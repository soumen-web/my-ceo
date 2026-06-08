import type { ReportingManagerInfo } from '@/modules/my-organization/domain/entities/ReportingManagerInfo';
import type { MyOrganizationRepository } from '@/modules/my-organization/domain/repositories/MyOrganizationRepository';

export class GetReportingManagerUseCase {
  public constructor(private readonly myOrganizationRepository: MyOrganizationRepository) {}

  public execute(): Promise<ReportingManagerInfo> {
    return this.myOrganizationRepository.getReportingManager();
  }
}
