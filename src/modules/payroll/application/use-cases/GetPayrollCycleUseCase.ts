import type { PayrollCycle } from '@/modules/payroll/domain/entities/Payroll';
import type { PayrollRepository } from '@/modules/payroll/domain/repositories/PayrollRepository';

export class GetPayrollCycleUseCase {
  public constructor(private readonly repository: PayrollRepository) {}

  public execute(cycleId: string): Promise<PayrollCycle | null> {
    return this.repository.getPayrollCycle(cycleId);
  }
}
