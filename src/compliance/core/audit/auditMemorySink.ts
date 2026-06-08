import type {
  ComplianceAuditEvent,
  ComplianceAuditSink,
} from '@compliance/core/types/audit';

const memoryEvents: ComplianceAuditEvent[] = [];

export const auditMemorySink: ComplianceAuditSink & {
  clear: () => void;
  getEvents: () => ComplianceAuditEvent[];
} = {
  clear() {
    memoryEvents.length = 0;
  },
  getEvents() {
    return [...memoryEvents];
  },
  write(event) {
    memoryEvents.push(event);
  },
};
