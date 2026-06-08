export type PayrollStatus = 'failed' | 'on-hold' | 'paid' | 'pending' | 'processing';

export type PayslipStatus = 'generated' | 'generating' | 'not-available';

export type PayrollBreakdownKind = 'deduction' | 'earning';

export interface PayrollAmountItem {
  amount: number;
  id: string;
  kind: PayrollBreakdownKind;
  label: string;
  note?: string;
}

export interface PayrollImpactItem {
  amount: number;
  id: string;
  label: string;
  note: string;
}

export interface PayrollStatutoryDetail {
  id: string;
  label: string;
  value: string;
}

export interface PayrollPaymentInfo {
  bankAccount: string;
  bankName: string;
  method: string;
  paidAt: string;
  reference: string;
}

export interface PayrollEmployeeMetadata {
  costCenter: string;
  employeeNumber: string;
  location: string;
  payGrade: string;
  payrollId: string;
  taxRegime: string;
}

export interface PayrollCycle {
  attendanceImpact: PayrollImpactItem[];
  deductions: PayrollAmountItem[];
  earnings: PayrollAmountItem[];
  employee: PayrollEmployeeMetadata;
  grossSalary: number;
  id: string;
  leaveImpact: PayrollImpactItem[];
  monthLabel: string;
  netSalary: number;
  paymentDate: string;
  paymentInfo: PayrollPaymentInfo;
  payslipStatus: PayslipStatus;
  periodEnd: string;
  periodStart: string;
  status: PayrollStatus;
  statusLabel: string;
  statutoryDetails: PayrollStatutoryDetail[];
  totalDeductions: number;
}

export interface PayslipSummary {
  cycleId: string;
  generatedAt: string;
  id: string;
  monthLabel: string;
  netSalary: number;
  paymentDate: string;
  status: PayrollStatus;
  statusLabel: string;
  payslipStatus: PayslipStatus;
}

export interface PayrollSnapshot {
  currentCycle: PayrollCycle | null;
  history: PayrollCycle[];
  payslips: PayslipSummary[];
}

export const createEmptyPayrollSnapshot = (): PayrollSnapshot => ({
  currentCycle: null,
  history: [],
  payslips: [],
});
