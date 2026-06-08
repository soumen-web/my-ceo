import { mergeCompliancePolicies } from '@compliance/core/policies/mergeCompliancePolicies';
import type { ComplianceAuditEvent } from '@compliance/core/types/audit';
import type { ComplianceConfig } from '@compliance/core/types/config';
import type { ComplianceModuleId } from '@compliance/core/types/modules';
import type { ResolvedCompliancePolicies } from '@compliance/core/types/policies';

import { complianceModuleRegistry } from '../registry/moduleDefinitions';

import type { ComplianceModuleDefinition } from '../registry/complianceModuleRegistry';

const getActiveModuleIds = (
  config: ComplianceConfig,
  scopeKey?: string,
): ComplianceModuleId[] => {
  const scopedModules = scopeKey ? config.scopedModules?.[scopeKey] ?? [] : [];

  return Array.from(new Set([...(config.enabledModules ?? []), ...scopedModules]));
};

export interface ComplianceEngine {
  activeModules: ComplianceModuleDefinition[];
  config: ComplianceConfig;
  enrichAuditEvent: (event: ComplianceAuditEvent) => ComplianceAuditEvent;
  getActiveModuleIds: (scopeKey?: string) => ComplianceModuleId[];
  isModuleEnabled: (moduleId: ComplianceModuleId, scopeKey?: string) => boolean;
  resolvedPolicies: ResolvedCompliancePolicies;
}

export const createComplianceEngine = (
  config: ComplianceConfig,
): ComplianceEngine => {
  const activeModules = complianceModuleRegistry.resolve(getActiveModuleIds(config));
  const resolvedPolicies = mergeCompliancePolicies(
    activeModules.map((moduleDefinition) => moduleDefinition.buildPolicies(config)),
  );

  return {
    activeModules,
    config,
    enrichAuditEvent: (event) =>
      activeModules.reduce<ComplianceAuditEvent>(
        (currentEvent, moduleDefinition) =>
          moduleDefinition.enrichAuditEvent?.(currentEvent, config) ?? currentEvent,
        event,
      ),
    getActiveModuleIds: (scopeKey) => getActiveModuleIds(config, scopeKey),
    isModuleEnabled: (moduleId, scopeKey) =>
      getActiveModuleIds(config, scopeKey).includes(moduleId),
    resolvedPolicies,
  };
};
