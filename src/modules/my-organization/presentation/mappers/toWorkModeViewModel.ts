import type { WorkModeInfo } from '@/modules/my-organization/domain/entities/WorkModeInfo';

import type { WorkModeViewModel } from '../view-models/WorkModeViewModel';

const fallback = (value: string | undefined, fallbackValue: string): string =>
  value?.trim() ? value.trim() : fallbackValue;

export const toWorkModeViewModel = (workMode: WorkModeInfo): WorkModeViewModel => ({
  rows: [
    { label: 'Work Mode', value: fallback(workMode.workMode, 'Not assigned') },
    {
      label: 'Employment Type',
      value: fallback(workMode.employmentType, 'Not assigned'),
    },
    { label: 'Work Week', value: fallback(workMode.workWeek, 'Not assigned') },
    {
      label: 'Holiday Calendar',
      value: fallback(workMode.holidayCalendar, 'Not assigned'),
    },
    {
      label: 'Shift Calendar',
      value: fallback(workMode.shiftCalendar, 'Not assigned'),
    },
  ],
  subtitle: 'Your assigned employment type and work arrangement.',
  title: 'Work Mode',
});
