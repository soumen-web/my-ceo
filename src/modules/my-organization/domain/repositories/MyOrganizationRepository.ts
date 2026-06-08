import type { MyOrganizationProfile } from '../entities/MyOrganizationProfile';
import type { OrganizationInfo } from '../entities/OrganizationInfo';
import type { ReportingManagerInfo } from '../entities/ReportingManagerInfo';
import type { TeamInfo } from '../entities/TeamInfo';
import type { WorkLocationInfo } from '../entities/WorkLocationInfo';
import type { WorkModeInfo } from '../entities/WorkModeInfo';

export interface MyOrganizationRepository {
  getMyOrganizationProfile(): Promise<MyOrganizationProfile>;
  getOrganizationInfo(): Promise<OrganizationInfo>;
  getMyTeam(): Promise<TeamInfo>;
  getReportingManager(): Promise<ReportingManagerInfo>;
  getWorkLocation(): Promise<WorkLocationInfo>;
  getWorkMode(): Promise<WorkModeInfo>;
}
