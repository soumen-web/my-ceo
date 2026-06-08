import type { ComponentProps } from 'react';

import { AppButton } from '@design-system/components';
import { useCompliance } from '@compliance/core/runtime/ComplianceProvider';

import type { DataClassification } from '@compliance/shared/utils/classifyData';
import type { AppCapability } from '@/services/access-control/types';

type AppButtonProps = ComponentProps<typeof AppButton>;

interface RestrictedActionButtonProps extends AppButtonProps {
  classification?: DataClassification;
  requiredCapability?: AppCapability;
}

export const RestrictedActionButton = ({
  classification,
  disabled,
  requiredCapability,
  ...props
}: RestrictedActionButtonProps) => {
  const { gateway } = useCompliance();
  const isRestricted =
    disabled ||
    (classification
      ? !gateway.canEditField({ classification, requiredCapability })
      : false);

  return <AppButton disabled={isRestricted} {...props} />;
};
