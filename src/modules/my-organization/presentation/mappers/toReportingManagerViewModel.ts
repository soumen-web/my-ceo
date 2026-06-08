import type { ReportingManagerInfo } from '@/modules/my-organization/domain/entities/ReportingManagerInfo';

import type { ReportingManagerViewModel } from '../view-models/ReportingManagerViewModel';

const fallback = (value: string | undefined, fallbackValue = 'Not assigned'): string =>
  value?.trim() ? value.trim() : fallbackValue;

export const toReportingManagerViewModel = (
  reportingManager: ReportingManagerInfo,
): ReportingManagerViewModel => ({
  rows: [
    { label: 'Manager', value: fallback(reportingManager.displayName) },
    {
      label: 'Employee Number',
      value: fallback(reportingManager.employeeNumber),
    },
    {
      label: 'Employee Record',
      value: fallback(reportingManager.employeeRecordId),
    },
  ],
  subtitle: 'Your current reporting manager assignment.',
  title: 'Reporting Manager',
});
