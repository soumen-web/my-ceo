import type { MyOrganizationProfile } from '@/modules/my-organization/domain/entities/MyOrganizationProfile';
import type { MyOrganizationRepository } from '@/modules/my-organization/domain/repositories/MyOrganizationRepository';

export class GetMyOrganizationProfileUseCase {
  public constructor(private readonly myOrganizationRepository: MyOrganizationRepository) {}

  public execute(): Promise<MyOrganizationProfile> {
    return this.myOrganizationRepository.getMyOrganizationProfile();
  }
}
