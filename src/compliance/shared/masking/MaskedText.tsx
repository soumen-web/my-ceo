import type { ComponentProps } from 'react';

import { AppText } from '@design-system/components';
import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';
import { useCompliance } from '@compliance/core/runtime/ComplianceProvider';

import type { DataClassification } from '@compliance/shared/utils/classifyData';

interface MaskedTextProps extends Omit<ComponentProps<typeof AppText>, 'children'> {
  classification: DataClassification;
  revealWhenAllowed?: boolean;
  value: string;
}

export const MaskedText = ({
  classification,
  revealWhenAllowed = false,
  value,
  ...props
}: MaskedTextProps) => {
  const { gateway } = useCompliance();

  const shouldReveal =
    revealWhenAllowed &&
    gateway.canViewField({
      classification,
    });
  const displayValue = shouldReveal
    ? value
    : String(complianceRuntime.maskValueForDisplay(value, classification));

  return (
    <AppText {...props}>{displayValue}</AppText>
  );
};
