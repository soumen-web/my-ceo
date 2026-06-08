import type { WorkModeInfo } from '@/modules/my-organization/domain/entities/WorkModeInfo';
import type { MyOrganizationRepository } from '@/modules/my-organization/domain/repositories/MyOrganizationRepository';

export class GetWorkModeUseCase {
  public constructor(private readonly myOrganizationRepository: MyOrganizationRepository) {}

  public execute(): Promise<WorkModeInfo> {
    return this.myOrganizationRepository.getWorkMode();
  }
}
