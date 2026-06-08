export type LeaveApprovalStage = 'applied' | 'manager-review' | 'hr-review' | 'closed';

export type LeaveRequestStatus =
  | 'approved'
  | 'cancelled'
  | 'draft'
  | 'pending'
  | 'rejected';

export type LeaveType =
  | 'casual'
  | 'comp-off'
  | 'earned'
  | 'maternity-paternity'
  | 'sick'
  | 'unpaid'
  | 'work-from-home';

export type LeaveDayPart = 'first-half' | 'full-day' | 'second-half';
export type LeaveDayType = 'FIRST_HALF' | 'FULL_DAY' | 'SECOND_HALF';

export interface LeaveBalance {
  available: number;
  booked: number;
  carryForward: number;
  label: string;
  total: number;
  type: LeaveType;
}

export interface LeaveTimelineEvent {
  at: string;
  id: string;
  label: string;
  stage: LeaveApprovalStage;
}

export interface LeaveRequest {
  approverName: string;
  dayPart: LeaveDayPart;
  days: number;
  endDate: string;
  id: string;
  reason: string;
  startDate: string;
  status: LeaveRequestStatus;
  statusLabel: string;
  submittedAt: string;
  timeline: LeaveTimelineEvent[];
  title: string;
  type: LeaveType;
}

export interface LeaveHoliday {
  date: string;
  id: string;
  label: string;
  region: string;
}

export interface TeamLeave {
  date: string;
  employeeName: string;
  id: string;
  status: LeaveRequestStatus;
  type: LeaveType;
}

export interface LeaveCalendarDay {
  date: string;
  holiday?: LeaveHoliday;
  requests: LeaveRequest[];
  teamLeaves: TeamLeave[];
}

export interface LeaveTrendPoint {
  label: string;
  used: number;
}

export interface LeaveInsight {
  body: string;
  id: string;
  title: string;
  tone: 'info' | 'positive' | 'warning';
}

export interface LeaveAnalytics {
  approvalRate: number;
  averageApprovalHours: number;
  balanceRisk: number;
  distribution: { label: string; type: LeaveType; value: number }[];
  monthlyUsage: LeaveTrendPoint[];
  streakProtectedDays: number;
}

export interface LeaveSnapshot {
  analytics: LeaveAnalytics;
  balances: LeaveBalance[];
  calendar: LeaveCalendarDay[];
  holidays: LeaveHoliday[];
  history: LeaveRequest[];
  insights: LeaveInsight[];
  pendingApprovals: LeaveRequest[];
  teamLeaves: TeamLeave[];
  upcoming: LeaveRequest[];
}

export interface ApplyLeaveRequest {
  dayPart: LeaveDayPart;
  endDate: string;
  reason: string;
  selectedDates?: {
    date: string;
    dayType: LeaveDayType;
    value: 0.5 | 1;
  }[];
  startDate: string;
  startDateType?: LeaveDayType;
  endDateType?: LeaveDayType;
  totalDays?: number;
  type: LeaveType;
}

export const leaveTypeLabel: Record<LeaveType, string> = {
  casual: 'Casual Leave',
  'comp-off': 'Comp Off',
  earned: 'Earned Leave',
  'maternity-paternity': 'Maternity/Paternity',
  sick: 'Sick Leave',
  unpaid: 'Unpaid Leave',
  'work-from-home': 'Work From Home',
};

export const createEmptyLeaveSnapshot = (): LeaveSnapshot => ({
  analytics: {
    approvalRate: 0,
    averageApprovalHours: 0,
    balanceRisk: 0,
    distribution: [],
    monthlyUsage: [],
    streakProtectedDays: 0,
  },
  balances: [],
  calendar: [],
  holidays: [],
  history: [],
  insights: [],
  pendingApprovals: [],
  teamLeaves: [],
  upcoming: [],
});
