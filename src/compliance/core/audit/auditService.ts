import { auditMemorySink } from './auditMemorySink';

import type { ComplianceAuditEvent, ComplianceAuditSink } from '@compliance/core/types/audit';
import type { ComplianceConfig } from '@compliance/core/types/config';
import type { ComplianceEngine } from '@compliance/core/engine/createComplianceEngine';
import type { CompliancePolicyGateway } from '@compliance/core/guards/CompliancePolicyGateway';
import type { ConsentState } from '@compliance/core/types/consent';

interface AuditContextSnapshot {
  config: ComplianceConfig;
  consentState: ConsentState;
  engine: ComplianceEngine;
  gateway: CompliancePolicyGateway;
}

let activeSink: ComplianceAuditSink = auditMemorySink;
let getAuditContext: (() => AuditContextSnapshot | null) | null = null;

export const auditService = {
  configureContextProvider(provider: () => AuditContextSnapshot | null): void {
    getAuditContext = provider;
  },
  configureSink(sink: ComplianceAuditSink): void {
    activeSink = sink;
  },
  getMemoryEvents(): ComplianceAuditEvent[] {
    return auditMemorySink.getEvents();
  },
  async record(event: ComplianceAuditEvent): Promise<ComplianceAuditEvent> {
    const context = getAuditContext?.() ?? null;
    const engine = context?.engine;
    const enrichedEvent =
      engine?.enrichAuditEvent({
        ...event,
        moduleIds: event.moduleIds.length ? event.moduleIds : engine.getActiveModuleIds(),
        tenantId: event.tenantId ?? context?.config.tenantId,
      }) ?? event;

    await activeSink.write(enrichedEvent);
    return enrichedEvent;
  },
  resetMemorySink(): void {
    auditMemorySink.clear();
    activeSink = auditMemorySink;
  },
};
