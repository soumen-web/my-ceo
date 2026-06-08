import type { TeamInfo } from '@/modules/my-organization/domain/entities/TeamInfo';
import type { MyOrganizationRepository } from '@/modules/my-organization/domain/repositories/MyOrganizationRepository';

export class GetMyTeamUseCase {
  public constructor(private readonly myOrganizationRepository: MyOrganizationRepository) {}

  public execute(): Promise<TeamInfo> {
    return this.myOrganizationRepository.getMyTeam();
  }
}
