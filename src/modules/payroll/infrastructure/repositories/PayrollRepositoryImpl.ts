import type {
  PayrollCycle,
  PayrollSnapshot,
} from '@/modules/payroll/domain/entities/Payroll';
import type { PayrollRepository } from '@/modules/payroll/domain/repositories/PayrollRepository';

import { createMockPayrollSnapshot } from '../mock/payrollMockData';

export class PayrollRepositoryImpl implements PayrollRepository {
  private readonly snapshot = createMockPayrollSnapshot();

  public async getPayrollCycle(cycleId: string): Promise<PayrollCycle | null> {
    return Promise.resolve(
      this.snapshot.history.find((cycle) => cycle.id === cycleId) ?? null,
    );
  }

  public async getPayrollSnapshot(): Promise<PayrollSnapshot> {
    return Promise.resolve(this.snapshot);
  }
}
