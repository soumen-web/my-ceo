import type { ComplianceConfig } from '@compliance/core/types/config';
import type { ComplianceModuleId } from '@compliance/core/types/modules';

const gdprRegions = new Set([
  'AT',
  'BE',
  'DE',
  'DK',
  'EE',
  'ES',
  'EU',
  'FI',
  'FR',
  'IE',
  'IT',
  'NL',
  'NO',
  'PL',
  'PT',
  'SE',
]);

export const resolveModuleActivation = (
  config: ComplianceConfig,
): ComplianceModuleId[] => {
  const resolvedModules = new Set<ComplianceModuleId>(config.enabledModules);

  if (config.region && gdprRegions.has(config.region.toUpperCase())) {
    resolvedModules.add('GDPR');
  }

  if (config.features?.healthcareTenant) {
    resolvedModules.add('HIPAA');
  }

  if (config.features?.paymentsEnabled) {
    resolvedModules.add('PCI');
  }

  return Array.from(resolvedModules);
};
