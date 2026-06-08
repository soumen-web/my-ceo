import type { MyOrganizationProfile } from '@/modules/my-organization/domain/entities/MyOrganizationProfile';
import type { OrganizationInfo } from '@/modules/my-organization/domain/entities/OrganizationInfo';
import type { ReportingManagerInfo } from '@/modules/my-organization/domain/entities/ReportingManagerInfo';
import type { TeamInfo } from '@/modules/my-organization/domain/entities/TeamInfo';
import type { WorkLocationInfo } from '@/modules/my-organization/domain/entities/WorkLocationInfo';
import type { WorkModeInfo } from '@/modules/my-organization/domain/entities/WorkModeInfo';
import type { MyOrganizationRepository } from '@/modules/my-organization/domain/repositories/MyOrganizationRepository';
import { myOrganizationApi } from '@/modules/my-organization/infrastructure/api/myOrganizationApi';
import { myOrganizationProfileMapper } from '@/modules/my-organization/infrastructure/mappers/myOrganizationProfileMapper';
import { organizationInfoMapper } from '@/modules/my-organization/infrastructure/mappers/organizationInfoMapper';
import { reportingManagerMapper } from '@/modules/my-organization/infrastructure/mappers/reportingManagerMapper';
import { teamMapper } from '@/modules/my-organization/infrastructure/mappers/teamMapper';
import { workLocationMapper } from '@/modules/my-organization/infrastructure/mappers/workLocationMapper';
import { workModeMapper } from '@/modules/my-organization/infrastructure/mappers/workModeMapper';

export class MyOrganizationRepositoryImpl implements MyOrganizationRepository {
  public async getMyOrganizationProfile(): Promise<MyOrganizationProfile> {
    const response = await myOrganizationApi.fetchMyOrganizationAnalytics();

    return myOrganizationProfileMapper.toDomain(response);
  }

  public async getOrganizationInfo(): Promise<OrganizationInfo> {
    const response = await myOrganizationApi.fetchMyOrganizationAnalytics();

    return organizationInfoMapper.toDomain(response);
  }

  public async getMyTeam(): Promise<TeamInfo> {
    const response = await myOrganizationApi.fetchMyOrganizationAnalytics();

    return teamMapper.toDomain(response);
  }

  public async getReportingManager(): Promise<ReportingManagerInfo> {
    const response = await myOrganizationApi.fetchMyOrganizationAnalytics();

    return reportingManagerMapper.toDomain(response);
  }

  public async getWorkLocation(): Promise<WorkLocationInfo> {
    const response = await myOrganizationApi.fetchMyOrganizationAnalytics();

    return workLocationMapper.toDomain(response);
  }

  public async getWorkMode(): Promise<WorkModeInfo> {
    const response = await myOrganizationApi.fetchMyOrganizationAnalytics();

    return workModeMapper.toDomain(response);
  }
}
