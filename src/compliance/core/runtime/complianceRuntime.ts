import { accessControlService } from '@/services/access-control/accessControlService';

import { auditService } from '@compliance/core/audit/auditService';
import { buildDefaultComplianceConfig } from '@compliance/core/config/defaultComplianceConfig';
import {
  createComplianceEngine,
  type ComplianceEngine,
} from '@compliance/core/engine/createComplianceEngine';
import { CompliancePolicyGateway } from '@compliance/core/guards/CompliancePolicyGateway';
import type { ComplianceAuditEvent } from '@compliance/core/types/audit';
import type { ConsentState } from '@compliance/core/types/consent';
import type { ComplianceConfig } from '@compliance/core/types/config';
import type {
  DataClassification,
  FieldClassificationMap,
} from '@compliance/shared/utils/classifyData';
import {
  maskForDisplay,
  sanitizeForLogs,
  sanitizeForTelemetry,
} from '@compliance/shared/redaction/sanitize';
import { createDefaultConsentState } from '@compliance/shared/consent/defaultConsentState';

interface ComplianceRuntimeSnapshot {
  config: ComplianceConfig;
  consentState: ConsentState;
  engine: ComplianceEngine;
  gateway: CompliancePolicyGateway;
}

const createSnapshot = (
  config: ComplianceConfig,
  consentState = createDefaultConsentState(config.region),
) => {
  const engine = createComplianceEngine(config);

  return {
    config,
    consentState,
    engine,
    gateway: new CompliancePolicyGateway({
      accessContext: accessControlService.buildGuestContext(),
      config,
      consentState,
      engine,
    }),
  } satisfies ComplianceRuntimeSnapshot;
};

let runtimeSnapshot = createSnapshot(buildDefaultComplianceConfig());

auditService.configureContextProvider(() => runtimeSnapshot);

export const complianceRuntime = {
  audit(event: ComplianceAuditEvent): Promise<ComplianceAuditEvent> {
    return auditService.record({
      ...event,
      moduleIds: event.moduleIds.length
        ? event.moduleIds
        : runtimeSnapshot.engine.getActiveModuleIds(),
    });
  },
  getActiveModuleIds(scopeKey?: string) {
    return runtimeSnapshot.engine.getActiveModuleIds(scopeKey);
  },
  getPolicyGateway(): CompliancePolicyGateway {
    return runtimeSnapshot.gateway;
  },
  getResolvedPolicies() {
    return runtimeSnapshot.engine.resolvedPolicies;
  },
  getSnapshot(): ComplianceRuntimeSnapshot {
    return runtimeSnapshot;
  },
  initialize(
    config: ComplianceConfig,
    accessContext = accessControlService.buildGuestContext(),
    consentState = createDefaultConsentState(config.region),
  ): ComplianceRuntimeSnapshot {
    const engine = createComplianceEngine(config);

    runtimeSnapshot = {
      config,
      consentState,
      engine,
      gateway: new CompliancePolicyGateway({
        accessContext,
        config,
        consentState,
        engine,
      }),
    };

    return runtimeSnapshot;
  },
  maskValueForDisplay(value: unknown, classification: DataClassification): unknown {
    return maskForDisplay(value, classification, runtimeSnapshot.engine.resolvedPolicies);
  },
  reset(): ComplianceRuntimeSnapshot {
    runtimeSnapshot = createSnapshot(buildDefaultComplianceConfig());
    return runtimeSnapshot;
  },
  sanitizeForLogs(value: unknown, metadata?: FieldClassificationMap): unknown {
    return sanitizeForLogs(value, metadata, runtimeSnapshot.engine.resolvedPolicies);
  },
  sanitizeForTelemetry(
    value: unknown,
    metadata?: FieldClassificationMap,
  ): unknown {
    return sanitizeForTelemetry(
      value,
      metadata,
      runtimeSnapshot.engine.resolvedPolicies,
    );
  },
};
