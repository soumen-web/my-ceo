import type { TeamInfo } from '@/modules/my-organization/domain/entities/TeamInfo';

import type { OrganizationAnalyticsResponseDto } from '../dtos/OrganizationAnalyticsDto';

const fallback = (
  value: string | null | undefined,
  fallbackValue = 'Not assigned',
): string => (value?.trim() ? value.trim() : fallbackValue);

export const teamMapper = {
  toDomain(response: OrganizationAnalyticsResponseDto): TeamInfo {
    const organization = response.data?.organization;
    const team = response.data?.team;

    return {
      businessUnit: fallback(organization?.businessUnit?.name),
      department: fallback(
        team?.department?.name ?? organization?.department?.name,
      ),
      legalEntity: fallback(organization?.legalEntity?.name),
      organization: fallback(organization?.org?.name),
      team: fallback(
        team?.name ?? organization?.team?.name,
      ),
    };
  },
};
