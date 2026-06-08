import type { PayrollCycle, PayrollSnapshot } from '../../domain/entities/Payroll';

export interface PayrollEnvelopeDto<TData = unknown> {
  data?: TData;
  message?: string;
  meta?: unknown;
  success?: boolean;
}

export type PayrollSnapshotDto = PayrollEnvelopeDto<PayrollSnapshot>;

export type PayrollCycleDto = PayrollEnvelopeDto<PayrollCycle>;
