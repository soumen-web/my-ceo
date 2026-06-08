import type { PayrollSnapshot } from '@/modules/payroll/domain/entities/Payroll';
import type { PayrollRepository } from '@/modules/payroll/domain/repositories/PayrollRepository';

export class GetPayrollSnapshotUseCase {
  public constructor(private readonly repository: PayrollRepository) {}

  public execute(): Promise<PayrollSnapshot> {
    return this.repository.getPayrollSnapshot();
  }
}
