import { gdprModuleDefinition } from '@compliance/gdpr/policies/gdprModule';
import { hipaaModuleDefinition } from '@compliance/hipaa/policies/hipaaModule';
import { pciModuleDefinition } from '@compliance/pci/policies/pciModule';

import { ComplianceModuleRegistry } from './complianceModuleRegistry';

export const complianceModuleRegistry = new ComplianceModuleRegistry();

complianceModuleRegistry.register(gdprModuleDefinition);
complianceModuleRegistry.register(hipaaModuleDefinition);
complianceModuleRegistry.register(pciModuleDefinition);
