import type { OrganizationInfo } from '@/modules/my-organization/domain/entities/OrganizationInfo';

import type { OrganizationAnalyticsResponseDto } from '../dtos/OrganizationAnalyticsDto';

const fallback = (
  value: string | null | undefined,
  fallbackValue = 'Not assigned',
): string => (value?.trim() ? value.trim() : fallbackValue);

export const organizationInfoMapper = {
  toDomain(response: OrganizationAnalyticsResponseDto): OrganizationInfo {
    const employee = response.data?.employee;
    const organization = response.data?.organization;
    const team = response.data?.team;
    const user = response.data?.user;

    return {
      businessUnit: fallback(organization?.businessUnit?.name),
      department: fallback(
        team?.department?.name ?? organization?.department?.name,
      ),
      email: fallback(user?.email),
      employeeName: fallback(employee?.preferredName ?? user?.displayName),
      employeeNumber: fallback(employee?.employeeNumber),
      employmentStatus: fallback(
        employee?.employmentStatus ?? user?.status,
      ),
      legalEntity: fallback(organization?.legalEntity?.name),
      location: fallback(organization?.location?.name),
      organization: fallback(organization?.org?.name),
      role: 'employee',
      team: fallback(
        team?.name ?? organization?.team?.name,
      ),
    };
  },
};
