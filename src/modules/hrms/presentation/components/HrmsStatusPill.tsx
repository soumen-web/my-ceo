import { EnterpriseStatusPill } from '@/design-system/components';

import type { HrmsStatusTone } from '@/modules/hrms/domain/entities/HrmsSelfService';

interface HrmsStatusPillProps {
  label: string;
  tone: HrmsStatusTone;
}

export const HrmsStatusPill = ({ label, tone }: HrmsStatusPillProps) => (
  <EnterpriseStatusPill label={label} tone={tone} />
);
