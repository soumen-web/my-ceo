import type { OrganizationInfo } from '@/modules/my-organization/domain/entities/OrganizationInfo';
import type { MyOrganizationRepository } from '@/modules/my-organization/domain/repositories/MyOrganizationRepository';

export class GetOrganizationInfoUseCase {
  public constructor(private readonly myOrganizationRepository: MyOrganizationRepository) {}

  public execute(): Promise<OrganizationInfo> {
    return this.myOrganizationRepository.getOrganizationInfo();
  }
}
