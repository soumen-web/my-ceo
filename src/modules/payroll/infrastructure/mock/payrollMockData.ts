import type { PayrollCycle, PayrollSnapshot } from '../../domain/entities/Payroll';

const employee = {
  costCenter: 'Enterprise Operations',
  employeeNumber: 'UH-EMP-1048',
  location: 'Bengaluru HQ',
  payGrade: 'L4',
  payrollId: 'PAY-UH-1048',
  taxRegime: 'New regime',
};

const paymentInfo = {
  bankAccount: '**** 4821',
  bankName: 'HDFC Bank',
  method: 'Bank transfer',
  paidAt: '2026-05-31',
  reference: 'UTR-8826419062',
};

const statutoryDetails = [
  { id: 'pan', label: 'PAN', value: '*****8821P' },
  { id: 'uan', label: 'UAN', value: '**** 3907' },
  { id: 'pf', label: 'PF account', value: 'PY/BOM/0042187' },
  { id: 'tax', label: 'Tax regime', value: 'New regime' },
];

const createCycle = ({
  id,
  monthLabel,
  netSalary,
  paymentDate,
  payslipStatus,
  status,
  statusLabel,
  totalDeductions,
}: Pick<
  PayrollCycle,
  | 'id'
  | 'monthLabel'
  | 'netSalary'
  | 'paymentDate'
  | 'payslipStatus'
  | 'status'
  | 'statusLabel'
  | 'totalDeductions'
>): PayrollCycle => {
  const [, year = '2026', month = '05'] = id.match(/^payroll-(\d{4})-(\d{2})$/) ?? [];
  const periodStart = `${year}-${month}-01`;
  const periodEnd = `${year}-${month}-${new Date(Number(year), Number(month), 0)
    .getDate()
    .toString()
    .padStart(2, '0')}`;
  const earnings = [
    { amount: 92000, id: `${id}-basic`, kind: 'earning' as const, label: 'Basic salary' },
    { amount: 36800, id: `${id}-hra`, kind: 'earning' as const, label: 'HRA' },
    { amount: 18200, id: `${id}-allowance`, kind: 'earning' as const, label: 'Flexi allowance' },
    { amount: 12500, id: `${id}-bonus`, kind: 'earning' as const, label: 'Bonus/Incentives' },
    { amount: 5400, id: `${id}-overtime`, kind: 'earning' as const, label: 'Overtime pay' },
    { amount: 4200, id: `${id}-reimbursements`, kind: 'earning' as const, label: 'Reimbursements' },
    { amount: 2100, id: `${id}-other`, kind: 'earning' as const, label: 'Other earnings' },
  ];
  const deductions = [
    { amount: 7200, id: `${id}-pf`, kind: 'deduction' as const, label: 'PF' },
    { amount: 0, id: `${id}-esi`, kind: 'deduction' as const, label: 'ESI', note: 'Not applicable' },
    { amount: 18600, id: `${id}-tds`, kind: 'deduction' as const, label: 'TDS/Tax' },
    { amount: 3500, id: `${id}-loan`, kind: 'deduction' as const, label: 'Loan deductions' },
    { amount: 1800, id: `${id}-leave`, kind: 'deduction' as const, label: 'Leave deductions' },
    { amount: Math.max(totalDeductions - 31100, 0), id: `${id}-other-deduction`, kind: 'deduction' as const, label: 'Other deductions' },
  ];

  return {
    attendanceImpact: [
      {
        amount: 5400,
        id: `${id}-overtime-impact`,
        label: 'Overtime approved',
        note: '12.5 approved hours added to this cycle.',
      },
      {
        amount: 0,
        id: `${id}-regularization-impact`,
        label: 'Attendance regularized',
        note: 'No unpaid attendance exceptions remain.',
      },
    ],
    deductions,
    earnings,
    employee,
    grossSalary: earnings.reduce((total, item) => total + item.amount, 0),
    id,
    leaveImpact: [
      {
        amount: -1800,
        id: `${id}-lop-impact`,
        label: 'Leave without pay',
        note: '0.5 day salary adjustment applied.',
      },
    ],
    monthLabel,
    netSalary,
    paymentDate,
    paymentInfo,
    payslipStatus,
    periodEnd,
    periodStart,
    status,
    statusLabel,
    statutoryDetails,
    totalDeductions,
  };
};

const history = [
  createCycle({
    id: 'payroll-2026-05',
    monthLabel: 'May 2026',
    netSalary: 140700,
    paymentDate: '2026-05-31',
    payslipStatus: 'generating',
    status: 'processing',
    statusLabel: 'Processing',
    totalDeductions: 30500,
  }),
  createCycle({
    id: 'payroll-2026-04',
    monthLabel: 'Apr 2026',
    netSalary: 137400,
    paymentDate: '2026-04-30',
    payslipStatus: 'generated',
    status: 'paid',
    statusLabel: 'Paid',
    totalDeductions: 33800,
  }),
  createCycle({
    id: 'payroll-2026-03',
    monthLabel: 'Mar 2026',
    netSalary: 132900,
    paymentDate: '2026-03-31',
    payslipStatus: 'generated',
    status: 'paid',
    statusLabel: 'Paid',
    totalDeductions: 38300,
  }),
  createCycle({
    id: 'payroll-2026-02',
    monthLabel: 'Feb 2026',
    netSalary: 0,
    paymentDate: '2026-02-28',
    payslipStatus: 'not-available',
    status: 'on-hold',
    statusLabel: 'On hold',
    totalDeductions: 0,
  }),
  createCycle({
    id: 'payroll-2026-01',
    monthLabel: 'Jan 2026',
    netSalary: 129850,
    paymentDate: '2026-01-31',
    payslipStatus: 'generated',
    status: 'paid',
    statusLabel: 'Paid',
    totalDeductions: 41350,
  }),
];

export const createMockPayrollSnapshot = (): PayrollSnapshot => ({
  currentCycle: history[0],
  history,
  payslips: history.map((cycle) => ({
    cycleId: cycle.id,
    generatedAt: cycle.payslipStatus === 'generated' ? cycle.paymentDate : '',
    id: `payslip-${cycle.id}`,
    monthLabel: cycle.monthLabel,
    netSalary: cycle.netSalary,
    paymentDate: cycle.paymentDate,
    payslipStatus: cycle.payslipStatus,
    status: cycle.status,
    statusLabel: cycle.statusLabel,
  })),
});
