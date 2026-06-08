import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAppSelector } from '@/app/providers/state/hooks';
import { selectAccessContext } from '@modules/auth';

import { buildDefaultComplianceConfig } from '@compliance/core/config/defaultComplianceConfig';
import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';
import type {
  ComplianceConfig,
  ComplianceConfigOverrides,
} from '@compliance/core/types/config';
import type { ConsentState } from '@compliance/core/types/consent';
import { createDefaultConsentState } from '@compliance/shared/consent/defaultConsentState';
import { consentService } from '@compliance/shared/consent/consentService';

import type { ComplianceEngine } from '@compliance/core/engine/createComplianceEngine';
import type { CompliancePolicyGateway } from '@compliance/core/guards/CompliancePolicyGateway';

interface ComplianceContextValue {
  config: ComplianceConfig;
  consentState: ConsentState;
  engine: ComplianceEngine;
  gateway: CompliancePolicyGateway;
  updateConsent: (updates: Partial<ConsentState>) => Promise<ConsentState>;
}

const ComplianceContext = createContext<ComplianceContextValue | null>(null);

interface ComplianceProviderProps {
  children: ReactNode;
  config?: ComplianceConfigOverrides;
}

export const ComplianceProvider = ({
  children,
  config,
}: ComplianceProviderProps) => {
  const accessContext = useAppSelector(selectAccessContext);
  const resolvedConfig = useMemo(
    () => buildDefaultComplianceConfig(config),
    [config],
  );
  const [consentState, setConsentState] = useState<ConsentState>(
    createDefaultConsentState(resolvedConfig.region),
  );

  useEffect(() => {
    let isMounted = true;

    void consentService.hydrate(resolvedConfig).then((hydratedConsentState) => {
      if (isMounted) {
        setConsentState(hydratedConsentState);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [resolvedConfig]);

  const runtimeSnapshot = useMemo(
    () => complianceRuntime.initialize(resolvedConfig, accessContext, consentState),
    [accessContext, consentState, resolvedConfig],
  );

  const updateConsent = useCallback(
    async (updates: Partial<ConsentState>): Promise<ConsentState> => {
      const nextConsentState = await consentService.update(updates, resolvedConfig);
      setConsentState(nextConsentState);

      void complianceRuntime.audit({
        action: 'consent_updated',
        details: {
          categories: updates.categories,
          privacyNoticeAccepted: updates.privacyNoticeAccepted,
        },
        moduleIds: runtimeSnapshot.engine.getActiveModuleIds(),
        outcome: 'recorded',
        timestamp: new Date().toISOString(),
      });

      return nextConsentState;
    },
    [resolvedConfig, runtimeSnapshot.engine],
  );

  const value = useMemo<ComplianceContextValue>(
    () => ({
      config: runtimeSnapshot.config,
      consentState,
      engine: runtimeSnapshot.engine,
      gateway: runtimeSnapshot.gateway,
      updateConsent,
    }),
    [consentState, runtimeSnapshot, updateConsent],
  );

  return (
    <ComplianceContext.Provider value={value}>
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = (): ComplianceContextValue => {
  const context = useContext(ComplianceContext);

  if (!context) {
    throw new Error('useCompliance must be used within a ComplianceProvider.');
  }

  return context;
};
