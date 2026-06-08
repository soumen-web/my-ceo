import type {
  ApplyLeaveRequest,
  LeaveBalance,
  LeaveCalendarDay,
  LeaveHoliday,
  LeaveInsight,
  LeaveRequest,
  LeaveSnapshot,
  LeaveTrendPoint,
  LeaveType,
  TeamLeave,
} from '@/modules/leave/domain/entities/Leave';
import { leaveTypeLabel } from '@/modules/leave/domain/entities/Leave';

const dateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const addDays = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  return dateKey(date);
};

const formatSubmitted = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const balancesSeed: LeaveBalance[] = [
  { available: 8, booked: 4, carryForward: 2, label: 'Casual Leave', total: 12, type: 'casual' },
  { available: 9, booked: 3, carryForward: 0, label: 'Sick Leave', total: 12, type: 'sick' },
  { available: 15, booked: 5, carryForward: 4, label: 'Earned Leave', total: 20, type: 'earned' },
  { available: 5, booked: 1, carryForward: 1, label: 'Work From Home', total: 6, type: 'work-from-home' },
  { available: 2, booked: 0, carryForward: 2, label: 'Comp Off', total: 2, type: 'comp-off' },
  {
    available: 90,
    booked: 0,
    carryForward: 0,
    label: 'Maternity/Paternity',
    total: 90,
    type: 'maternity-paternity',
  },
  { available: 0, booked: 1, carryForward: 0, label: 'Unpaid Leave', total: 0, type: 'unpaid' },
];

const timeline = (status: LeaveRequest['status']) => [
  { at: '09:42 AM', id: 'applied', label: 'Application submitted', stage: 'applied' as const },
  {
    at: status === 'pending' ? 'Pending' : '11:18 AM',
    id: 'manager',
    label: status === 'pending' ? 'Manager review pending' : 'Manager approved',
    stage: 'manager-review' as const,
  },
  {
    at: status === 'approved' ? '02:05 PM' : 'Pending',
    id: 'hr',
    label: status === 'approved' ? 'HR closure completed' : 'Awaiting HR closure',
    stage: 'hr-review' as const,
  },
];

const createLeave = (
  id: string,
  type: LeaveType,
  startOffset: number,
  endOffset: number,
  days: number,
  status: LeaveRequest['status'],
  reason: string,
  dayPart: LeaveRequest['dayPart'] = 'full-day',
): LeaveRequest => ({
  approverName: 'Ananya Rao',
  dayPart,
  days,
  endDate: addDays(endOffset),
  id,
  reason,
  startDate: addDays(startOffset),
  status,
  statusLabel: status === 'approved' ? 'Approved' : status === 'pending' ? 'Pending approval' : 'Rejected',
  submittedAt: formatSubmitted(startOffset - 8),
  timeline: timeline(status),
  title: leaveTypeLabel[type],
  type,
});

const historySeed: LeaveRequest[] = [
  createLeave('leave-annual-reset', 'earned', -18, -16, 3, 'approved', 'Family travel plan.'),
  createLeave('leave-health', 'sick', -10, -10, 1, 'approved', 'Medical recovery.'),
  createLeave('leave-half-day', 'casual', -5, -5, 0.5, 'approved', 'Personal appointment.', 'second-half'),
  createLeave('leave-unpaid', 'unpaid', -28, -28, 1, 'approved', 'Urgent personal commitment.'),
];

const pendingSeed: LeaveRequest[] = [
  createLeave('leave-pending-wfh', 'work-from-home', 2, 2, 1, 'pending', 'Need focused work time.'),
  createLeave('leave-pending-casual', 'casual', 12, 13, 2, 'pending', 'Family function.'),
];

const upcomingSeed: LeaveRequest[] = [
  createLeave('leave-upcoming-earned', 'earned', 20, 23, 4, 'approved', 'Planned annual break.'),
  createLeave('leave-upcoming-comp', 'comp-off', 30, 30, 1, 'approved', 'Comp-off against weekend release.'),
];

const holidaysSeed: LeaveHoliday[] = [
  { date: addDays(6), id: 'holiday-republic', label: 'Regional Foundation Day', region: 'IN-BLR' },
  { date: addDays(24), id: 'holiday-festival', label: 'Spring Festival', region: 'IN' },
  { date: addDays(46), id: 'holiday-public', label: 'Public Holiday', region: 'IN' },
];

const teamLeavesSeed: TeamLeave[] = [
  { date: addDays(3), employeeName: 'Rohan Mehta', id: 'team-rohan', status: 'approved', type: 'sick' },
  { date: addDays(4), employeeName: 'Priya Nair', id: 'team-priya', status: 'approved', type: 'earned' },
  { date: addDays(11), employeeName: 'Dev Shah', id: 'team-dev', status: 'pending', type: 'work-from-home' },
  { date: addDays(20), employeeName: 'Aisha Khan', id: 'team-aisha', status: 'approved', type: 'casual' },
];

const monthlyUsageSeed: LeaveTrendPoint[] = [
  { label: 'Jan', used: 1 },
  { label: 'Feb', used: 2 },
  { label: 'Mar', used: 0.5 },
  { label: 'Apr', used: 3 },
  { label: 'May', used: 1 },
  { label: 'Jun', used: 2.5 },
];

const insightsSeed: LeaveInsight[] = [
  {
    body: 'You have strong earned leave coverage for planned annual breaks.',
    id: 'earned-coverage',
    title: 'Healthy earned balance',
    tone: 'positive',
  },
  {
    body: 'Two pending requests overlap with high team absence days. Manager review may take longer.',
    id: 'team-overlap',
    title: 'Approval watch',
    tone: 'warning',
  },
  {
    body: 'Comp off expires in 34 days. Consider scheduling a short recharge day.',
    id: 'comp-off-expiry',
    title: 'Comp-off expiry',
    tone: 'info',
  },
];

const buildCalendar = (
  requests: LeaveRequest[],
  holidays: LeaveHoliday[],
  teamLeaves: TeamLeave[],
): LeaveCalendarDay[] => {
  const days = new Map<string, LeaveCalendarDay>();

  const ensureDay = (date: string) => {
    const existing = days.get(date);

    if (existing) {
      return existing;
    }

    const day: LeaveCalendarDay = { date, requests: [], teamLeaves: [] };
    days.set(date, day);

    return day;
  };

  requests.forEach((request) => {
    const start = new Date(`${request.startDate}T12:00:00`);
    const end = new Date(`${request.endDate}T12:00:00`);

    for (
      const cursor = new Date(start);
      cursor.getTime() <= end.getTime();
      cursor.setDate(cursor.getDate() + 1)
    ) {
      ensureDay(dateKey(cursor)).requests.push(request);
    }
  });

  holidays.forEach((holiday) => {
    ensureDay(holiday.date).holiday = holiday;
  });

  teamLeaves.forEach((leave) => {
    ensureDay(leave.date).teamLeaves.push(leave);
  });

  return Array.from(days.values()).sort((a, b) => a.date.localeCompare(b.date));
};

export const createMockLeaveSnapshot = (
  override?: Partial<LeaveSnapshot>,
): LeaveSnapshot => {
  const history = [...pendingSeed, ...upcomingSeed, ...historySeed];
  const calendar = buildCalendar(history, holidaysSeed, teamLeavesSeed);

  return {
    analytics: {
      approvalRate: 92,
      averageApprovalHours: 7,
      balanceRisk: 18,
      distribution: [
        { label: 'Earned', type: 'earned', value: 8 },
        { label: 'Casual', type: 'casual', value: 4.5 },
        { label: 'Sick', type: 'sick', value: 1 },
        { label: 'WFH', type: 'work-from-home', value: 3 },
      ],
      monthlyUsage: monthlyUsageSeed,
      streakProtectedDays: 11,
    },
    balances: balancesSeed,
    calendar,
    history,
    holidays: holidaysSeed,
    insights: insightsSeed,
    pendingApprovals: pendingSeed,
    teamLeaves: teamLeavesSeed,
    upcoming: upcomingSeed,
    ...override,
  };
};

export const applyMockLeaveRequest = (
  snapshot: LeaveSnapshot,
  request: ApplyLeaveRequest,
): LeaveSnapshot => {
  const days =
    request.totalDays ??
    (request.dayPart === 'full-day'
      ? Math.max(
          1,
          Math.round(
            (new Date(`${request.endDate}T12:00:00`).getTime() -
              new Date(`${request.startDate}T12:00:00`).getTime()) /
              (24 * 60 * 60 * 1000),
          ) + 1,
        )
      : 0.5);
  const leave = createLeave(
    `leave-local-${Date.now()}`,
    request.type,
    0,
    0,
    days,
    'pending',
    request.reason,
    request.dayPart,
  );
  const nextLeave = {
    ...leave,
    endDate: request.endDate,
    startDate: request.startDate,
  };
  const balances = snapshot.balances.map((balance) =>
    balance.type === request.type
      ? {
          ...balance,
          available: Math.max(0, balance.available - days),
          booked: balance.booked + days,
        }
      : balance,
  );
  const history = [nextLeave, ...snapshot.history];
  const pendingApprovals = [nextLeave, ...snapshot.pendingApprovals];

  return {
    ...snapshot,
    balances,
    calendar: buildCalendar(history, snapshot.holidays, snapshot.teamLeaves),
    history,
    pendingApprovals,
  };
};
