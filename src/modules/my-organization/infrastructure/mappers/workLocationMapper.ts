import type { WorkLocationInfo } from '@/modules/my-organization/domain/entities/WorkLocationInfo';

import type { OrganizationAnalyticsResponseDto } from '../dtos/OrganizationAnalyticsDto';

const fallback = (
  value: string | null | undefined,
  fallbackValue = 'Not assigned',
): string => (value?.trim() ? value.trim() : fallbackValue);

export const workLocationMapper = {
  toDomain(response: OrganizationAnalyticsResponseDto): WorkLocationInfo {
    const organization = response.data?.organization;
    const team = response.data?.team;
    const workLocation = response.data?.workLocation ?? organization?.location;

    return {
      businessUnit: fallback(organization?.businessUnit?.name),
      department: fallback(
        team?.department?.name ?? organization?.department?.name,
      ),
      location: fallback(workLocation?.name),
      locationCode: fallback(workLocation?.code),
      team: fallback(
        team?.name ?? organization?.team?.name,
      ),
    };
  },
};
