import type { MyOrganizationProfile } from '@/modules/my-organization/domain/entities/MyOrganizationProfile';

import type { OrganizationAnalyticsResponseDto } from '../dtos/OrganizationAnalyticsDto';
import { organizationInfoMapper } from './organizationInfoMapper';
import { reportingManagerMapper } from './reportingManagerMapper';
import { teamMapper } from './teamMapper';
import { workLocationMapper } from './workLocationMapper';
import { workModeMapper } from './workModeMapper';

export const myOrganizationProfileMapper = {
  toDomain(response: OrganizationAnalyticsResponseDto): MyOrganizationProfile {
    return {
      organizationInfo: organizationInfoMapper.toDomain(response),
      reportingManager: reportingManagerMapper.toDomain(response),
      team: teamMapper.toDomain(response),
      workLocation: workLocationMapper.toDomain(response),
      workMode: workModeMapper.toDomain(response),
    };
  },
};
