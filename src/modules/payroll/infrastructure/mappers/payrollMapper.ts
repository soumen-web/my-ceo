import type { PayrollCycle, PayrollSnapshot } from '../../domain/entities/Payroll';
import { createEmptyPayrollSnapshot } from '../../domain/entities/Payroll';
import type { PayrollCycleDto, PayrollSnapshotDto } from '../dtos/PayrollDto';

export const payrollMapper = {
  cycleToDomain(envelope: PayrollCycleDto): PayrollCycle | null {
    return envelope.data ?? null;
  },
  snapshotToDomain(envelope: PayrollSnapshotDto): PayrollSnapshot {
    return envelope.data ?? createEmptyPayrollSnapshot();
  },
};
