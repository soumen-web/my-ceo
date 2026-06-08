import type { OrganizationInfo } from '@/modules/my-organization/domain/entities/OrganizationInfo';

import type { OrganizationInfoViewModel } from '../view-models/OrganizationInfoViewModel';

const fallback = (value: string | undefined, fallbackValue = 'Not assigned'): string =>
  value?.trim() ? value.trim() : fallbackValue;

const formatRole = (value: string | undefined): string =>
  fallback(value, 'employee').toLowerCase();

export const toOrganizationInfoViewModel = (
  organizationInfo: OrganizationInfo,
): OrganizationInfoViewModel => ({
  rows: [
    { label: 'Employee Name', value: fallback(organizationInfo.employeeName) },
    { label: 'Email', value: fallback(organizationInfo.email) },
    { label: 'Employee Number', value: fallback(organizationInfo.employeeNumber) },
    {
      label: 'Employment Status',
      value: fallback(organizationInfo.employmentStatus),
    },
    { label: 'Roles', value: formatRole(organizationInfo.role) },
    {
      label: 'Organization',
      value: fallback(organizationInfo.organization),
    },
    {
      label: 'Legal Entity',
      value: fallback(organizationInfo.legalEntity),
    },
    {
      label: 'Business Unit',
      value: fallback(organizationInfo.businessUnit),
    },
    {
      label: 'Department',
      value: fallback(organizationInfo.department),
    },
    { label: 'Team', value: fallback(organizationInfo.team) },
    {
      label: 'Location',
      value: fallback(organizationInfo.location),
    },
  ],
  subtitle: 'Your employee identity and organization placement.',
  title: 'Organization Info',
});
