import type { AppEnvironment } from '@shared/types/env';

import type { ComplianceModuleId } from './modules';

export interface ComplianceConfig {
  enabledModules: ComplianceModuleId[];
  environment: AppEnvironment;
  features?: Record<string, boolean> | undefined;
  region?: string | undefined;
  scopedModules?: Record<string, ComplianceModuleId[]> | undefined;
  tenantId?: string | undefined;
}

export interface ComplianceConfigOverrides extends Partial<ComplianceConfig> {
  features?: Record<string, boolean>;
}
