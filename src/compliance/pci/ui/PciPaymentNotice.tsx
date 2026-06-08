import { AppCard, AppCardContent, AppText } from '@design-system/components';
import { useCompliance } from '@compliance/core/runtime/ComplianceProvider';

export const PciPaymentNotice = () => {
  const { engine } = useCompliance();

  if (!engine.isModuleEnabled('PCI')) {
    return null;
  }

  return (
    <AppCard mode="outlined">
      <AppCardContent>
        <AppText variant="titleMedium">Payment flow guardrails</AppText>
        <AppText variant="bodyMedium">
          PCI scope-minimising controls require tokenized or hosted payment flows. Raw PAN and CVV values must not be cached, logged, or persisted locally.
        </AppText>
      </AppCardContent>
    </AppCard>
  );
};
