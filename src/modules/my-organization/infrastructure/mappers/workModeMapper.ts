import type { WorkModeInfo } from '@/modules/my-organization/domain/entities/WorkModeInfo';

import type { OrganizationAnalyticsResponseDto, OrganizationNodeDto } from '../dtos/OrganizationAnalyticsDto';

const fallback = (value: string | null | undefined, fallbackValue: string): string =>
  value?.trim() ? value.trim() : fallbackValue;

const getAssignmentName = (
  value: OrganizationNodeDto | string | null | undefined,
  fallbackValue = 'Not assigned',
): string => {
  if (typeof value === 'string') {
    return fallback(value, fallbackValue);
  }

  return fallback(value?.name, fallbackValue);
};

export const workModeMapper = {
  toDomain(response: OrganizationAnalyticsResponseDto): WorkModeInfo {
    const data = response.data;

    return {
      employmentType: getAssignmentName(data?.employmentType),
      holidayCalendar: getAssignmentName(data?.workSetup?.holidayCalendar),
      shiftCalendar: getAssignmentName(data?.workSetup?.shiftCalendar),
      workMode: getAssignmentName(data?.workMode),
      workWeek: getAssignmentName(data?.workSetup?.workWeek),
    };
  },
};
