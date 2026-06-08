import type { OrganizationInfo } from './OrganizationInfo';
import type { ReportingManagerInfo } from './ReportingManagerInfo';
import type { TeamInfo } from './TeamInfo';
import type { WorkLocationInfo } from './WorkLocationInfo';
import type { WorkModeInfo } from './WorkModeInfo';

export interface MyOrganizationProfile {
  organizationInfo: OrganizationInfo;
  reportingManager: ReportingManagerInfo;
  team: TeamInfo;
  workLocation: WorkLocationInfo;
  workMode: WorkModeInfo;
}
