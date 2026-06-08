import { AppButton, AppCard, AppCardContent, AppText } from '@design-system/components';
import { useCompliance } from '@compliance/core/runtime/ComplianceProvider';

export const GdprConsentNotice = () => {
  const { consentState, engine, updateConsent } = useCompliance();

  if (
    !engine.isModuleEnabled('GDPR') ||
    consentState.privacyNoticeAccepted
  ) {
    return null;
  }

  return (
    <AppCard mode="outlined">
      <AppCardContent>
        <AppText variant="titleMedium">Privacy notice</AppText>
        <AppText variant="bodyMedium">
          GDPR-aligned controls are active. Confirm the privacy notice before enabling consent-dependent telemetry or rights workflows.
        </AppText>
        <AppButton
          mode="contained"
          onPress={() =>
            void updateConsent({
              privacyNoticeAccepted: true,
            })
          }
        >
          Acknowledge notice
        </AppButton>
      </AppCardContent>
    </AppCard>
  );
};
