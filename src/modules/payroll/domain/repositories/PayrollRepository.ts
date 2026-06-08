import type { PayrollCycle, PayrollSnapshot } from '../entities/Payroll';

export interface PayrollRepository {
  getPayrollCycle(cycleId: string): Promise<PayrollCycle | null>;
  getPayrollSnapshot(): Promise<PayrollSnapshot>;
}
