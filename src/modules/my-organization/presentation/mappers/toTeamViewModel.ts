import type { TeamInfo } from '@/modules/my-organization/domain/entities/TeamInfo';

import type { TeamViewModel } from '../view-models/TeamViewModel';

const fallback = (value: string | undefined, fallbackValue = 'Not assigned'): string =>
  value?.trim() ? value.trim() : fallbackValue;

export const toTeamViewModel = (teamInfo: TeamInfo): TeamViewModel => ({
  rows: [
    { label: 'Team', value: fallback(teamInfo.team) },
    {
      label: 'Department',
      value: fallback(teamInfo.department),
    },
    {
      label: 'Business Unit',
      value: fallback(teamInfo.businessUnit),
    },
    {
      label: 'Legal Entity',
      value: fallback(teamInfo.legalEntity),
    },
    {
      label: 'Organization',
      value: fallback(teamInfo.organization),
    },
  ],
  subtitle: 'Your team, department, and business unit context.',
  title: 'Team',
});
