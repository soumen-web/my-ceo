import type { WorkLocationInfo } from '@/modules/my-organization/domain/entities/WorkLocationInfo';

import type { WorkLocationViewModel } from '../view-models/WorkLocationViewModel';

const fallback = (value: string | undefined, fallbackValue = 'Not assigned'): string =>
  value?.trim() ? value.trim() : fallbackValue;

export const toWorkLocationViewModel = (
  workLocation: WorkLocationInfo,
): WorkLocationViewModel => ({
  rows: [
    { label: 'Location', value: fallback(workLocation.location) },
    { label: 'Location Code', value: fallback(workLocation.locationCode) },
    {
      label: 'Business Unit',
      value: fallback(workLocation.businessUnit),
    },
    {
      label: 'Department',
      value: fallback(workLocation.department),
    },
    { label: 'Team', value: fallback(workLocation.team) },
  ],
  subtitle: 'Your assigned workplace location.',
  title: 'Work Location',
});
