import type { ReactNode } from 'react';

import { useCompliance } from '@compliance/core/runtime/ComplianceProvider';

import type { ConsentCategory } from '@compliance/core/types/consent';

interface ConsentGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredCategories?: ConsentCategory[];
}

export const ConsentGate = ({
  children,
  fallback = null,
  requiredCategories,
}: ConsentGateProps) => {
  const { consentState, engine } = useCompliance();

  const categoriesToCheck =
    requiredCategories ?? engine.resolvedPolicies.consent.requiredCategories;
  const hasRequiredConsent = categoriesToCheck.every(
    (category) => consentState.categories[category] === 'granted',
  );

  return <>{hasRequiredConsent ? children : fallback}</>;
};
