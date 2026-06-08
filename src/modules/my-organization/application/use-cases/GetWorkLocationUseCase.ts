import type { WorkLocationInfo } from '@/modules/my-organization/domain/entities/WorkLocationInfo';
import type { MyOrganizationRepository } from '@/modules/my-organization/domain/repositories/MyOrganizationRepository';

export class GetWorkLocationUseCase {
  public constructor(private readonly myOrganizationRepository: MyOrganizationRepository) {}

  public execute(): Promise<WorkLocationInfo> {
    return this.myOrganizationRepository.getWorkLocation();
  }
}
