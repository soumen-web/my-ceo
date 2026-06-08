import type { ReportingManagerInfo } from '@/modules/my-organization/domain/entities/ReportingManagerInfo';

import type { OrganizationAnalyticsResponseDto } from '../dtos/OrganizationAnalyticsDto';

const fallback = (
  value: string | null | undefined,
  fallbackValue = 'Not assigned',
): string => (value?.trim() ? value.trim() : fallbackValue);

export const reportingManagerMapper = {
  toDomain(response: OrganizationAnalyticsResponseDto): ReportingManagerInfo {
    const reportingManager = response.data?.reportingManager;

    return {
      displayName: fallback(reportingManager?.displayName),
      employeeNumber: fallback(reportingManager?.employeeNumber),
      employeeRecordId: fallback(reportingManager?.employeeRecordId),
    };
  },
};
