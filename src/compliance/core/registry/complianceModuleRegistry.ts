import type { ComplianceAuditEvent } from '@compliance/core/types/audit';
import type { ComplianceConfig } from '@compliance/core/types/config';
import type { ComplianceModuleId } from '@compliance/core/types/modules';
import type { PartialCompliancePolicies } from '@compliance/core/types/policies';

export interface ComplianceModuleDefinition {
  buildPolicies: (config: ComplianceConfig) => PartialCompliancePolicies;
  enrichAuditEvent?: (
    event: ComplianceAuditEvent,
    config: ComplianceConfig,
  ) => ComplianceAuditEvent;
  id: ComplianceModuleId;
  priority: number;
}

export class ComplianceModuleRegistry {
  private readonly moduleDefinitions = new Map<
    ComplianceModuleId,
    ComplianceModuleDefinition
  >();

  public register(definition: ComplianceModuleDefinition): void {
    this.moduleDefinitions.set(definition.id, definition);
  }

  public resolve(moduleIds: ComplianceModuleId[]): ComplianceModuleDefinition[] {
    return moduleIds
      .map((moduleId) => this.moduleDefinitions.get(moduleId))
      .filter(
        (
          definition,
        ): definition is ComplianceModuleDefinition => definition !== undefined,
      )
      .sort((left, right) => left.priority - right.priority);
  }
}
