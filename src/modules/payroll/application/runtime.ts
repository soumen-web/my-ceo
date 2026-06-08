import { GetPayrollCycleUseCase } from '@/modules/payroll/application/use-cases/GetPayrollCycleUseCase';
import { GetPayrollSnapshotUseCase } from '@/modules/payroll/application/use-cases/GetPayrollSnapshotUseCase';
import { PayrollRepositoryImpl } from '@/modules/payroll/infrastructure/repositories/PayrollRepositoryImpl';

const payrollRepository = new PayrollRepositoryImpl();

export const payrollUseCases = {
  getPayrollCycle: new GetPayrollCycleUseCase(payrollRepository),
  getPayrollSnapshot: new GetPayrollSnapshotUseCase(payrollRepository),
};
