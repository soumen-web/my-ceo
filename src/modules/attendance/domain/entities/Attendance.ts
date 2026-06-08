export type AttendanceDayStatus =
  | 'absent'
  | 'early'
  | 'holiday'
  | 'late'
  | 'leave'
  | 'present'
  | 'weekend';

export type AttendancePunchType = 'break-end' | 'break-start' | 'clock-in' | 'clock-out';

export type AttendanceTrendDirection = 'down' | 'stable' | 'up';

export type AttendanceWorkMode = 'office' | 'remote' | 'wfh';

export interface AttendancePunch {
  id: string;
  label: string;
  location: string;
  mode: AttendanceWorkMode;
  time: string;
  type: AttendancePunchType;
}

export interface AttendanceToday {
  dateLabel: string;
  earlyByMinutes: number;
  firstInTime: string;
  isClockedIn: boolean;
  isReady: boolean;
  lastOutTime: string;
  lateByMinutes: number;
  shiftLabel: string;
  status: AttendanceDayStatus;
  statusLabel: string;
  workDurationMinutes: number;
  workMode: AttendanceWorkMode;
}

export interface AttendanceMetric {
  label: string;
  trend: AttendanceTrendDirection;
  value: string;
}

export interface AttendanceMonthSummary {
  absentDays: number;
  attendanceRate: number;
  earlyDepartures: number;
  lateArrivals: number;
  leaveDays: number;
  monthLabel: string;
  presentDays: number;
  readinessScore: number;
  workHours: number;
}

export interface AttendanceTrendPoint {
  label: string;
  present: number;
  target: number;
}

export interface AttendanceWorkModeInsight {
  days: number;
  label: string;
  mode: AttendanceWorkMode;
  percentage: number;
}

export interface AttendanceInsight {
  body: string;
  id: string;
  label: string;
  tone: 'critical' | 'info' | 'positive' | 'warning';
}

export interface AttendanceHistoryDay {
  date: string;
  dateLabel: string;
  dayLabel: string;
  firstInTime: string;
  id: string;
  lastOutTime: string;
  status: AttendanceDayStatus;
  statusLabel: string;
  totalMinutes: number;
  workMode: AttendanceWorkMode;
}

export interface AttendanceDayDetail extends AttendanceHistoryDay {
  breakMinutes: number;
  earlyByMinutes: number;
  lateByMinutes: number;
  location: string;
  notes: string;
  punches: AttendancePunch[];
  shiftLabel: string;
}

export interface AttendanceSnapshot {
  history: AttendanceHistoryDay[];
  insights: AttendanceInsight[];
  metrics: AttendanceMetric[];
  month: AttendanceMonthSummary;
  recentPunches: AttendancePunch[];
  today: AttendanceToday;
  trends: AttendanceTrendPoint[];
  workModes: AttendanceWorkModeInsight[];
}

export interface AttendancePunchRequest {
  mode: AttendanceWorkMode;
  note?: string;
  type: Extract<AttendancePunchType, 'clock-in' | 'clock-out'>;
}

export const createEmptyAttendanceToday = (): AttendanceToday => ({
  dateLabel: 'Today',
  earlyByMinutes: 0,
  firstInTime: '--',
  isClockedIn: false,
  isReady: false,
  lastOutTime: '--',
  lateByMinutes: 0,
  shiftLabel: 'Shift not assigned',
  status: 'absent',
  statusLabel: 'Not started',
  workDurationMinutes: 0,
  workMode: 'office',
});

export const createEmptyAttendanceSnapshot = (): AttendanceSnapshot => ({
  history: [],
  insights: [],
  metrics: [],
  month: {
    absentDays: 0,
    attendanceRate: 0,
    earlyDepartures: 0,
    lateArrivals: 0,
    leaveDays: 0,
    monthLabel: 'This month',
    presentDays: 0,
    readinessScore: 0,
    workHours: 0,
  },
  recentPunches: [],
  today: createEmptyAttendanceToday(),
  trends: [],
  workModes: [],
});
