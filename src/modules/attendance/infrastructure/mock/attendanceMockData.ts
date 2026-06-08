import type {
  AttendanceDayDetail,
  AttendanceDayStatus,
  AttendanceHistoryDay,
  AttendanceInsight,
  AttendanceMetric,
  AttendanceMonthSummary,
  AttendancePunch,
  AttendancePunchRequest,
  AttendanceSnapshot,
  AttendanceTrendPoint,
  AttendanceWorkMode,
  AttendanceWorkModeInsight,
} from '@/modules/attendance/domain/entities/Attendance';

const dayMs = 24 * 60 * 60 * 1000;

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatDateLabel = (date: Date): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

const formatDayLabel = (date: Date): string =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date);

const statusLabelByStatus: Record<AttendanceDayStatus, string> = {
  absent: 'Absent',
  early: 'Early leave',
  holiday: 'Holiday',
  late: 'Late arrival',
  leave: 'On leave',
  present: 'Present',
  weekend: 'Weekend',
};

const createPunch = (
  id: string,
  label: string,
  time: string,
  type: AttendancePunch['type'],
  mode: AttendanceWorkMode,
  location = 'Bengaluru HQ',
): AttendancePunch => ({
  id,
  label,
  location,
  mode,
  time,
  type,
});

const createHistoryDay = (
  offset: number,
  status: AttendanceDayStatus,
  totalMinutes: number,
  mode: AttendanceWorkMode,
  firstInTime = '09:28 AM',
  lastOutTime = '06:22 PM',
): AttendanceHistoryDay => {
  const date = new Date(Date.now() - offset * dayMs);

  return {
    date: formatDateKey(date),
    dateLabel: formatDateLabel(date),
    dayLabel: formatDayLabel(date),
    firstInTime,
    id: `attendance-${formatDateKey(date)}`,
    lastOutTime,
    status,
    statusLabel: statusLabelByStatus[status],
    totalMinutes,
    workMode: mode,
  };
};

const createHistoryDayForDate = (dateKey: string): AttendanceHistoryDay => {
  const date = new Date(`${dateKey}T12:00:00`);
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const status: AttendanceDayStatus = isWeekend ? 'weekend' : 'absent';

  return {
    date: dateKey,
    dateLabel: formatDateLabel(date),
    dayLabel: formatDayLabel(date),
    firstInTime: '--',
    id: `attendance-${dateKey}`,
    lastOutTime: '--',
    status,
    statusLabel: statusLabelByStatus[status],
    totalMinutes: 0,
    workMode: 'office',
  };
};

const historySeed: AttendanceHistoryDay[] = [
  createHistoryDay(0, 'present', 376, 'office', '09:26 AM', '--'),
  createHistoryDay(1, 'present', 526, 'wfh', '09:18 AM', '06:04 PM'),
  createHistoryDay(2, 'late', 492, 'office', '09:54 AM', '06:06 PM'),
  createHistoryDay(3, 'present', 518, 'remote', '09:22 AM', '06:00 PM'),
  createHistoryDay(4, 'early', 446, 'office', '09:16 AM', '04:42 PM'),
  createHistoryDay(5, 'weekend', 0, 'office', '--', '--'),
  createHistoryDay(6, 'weekend', 0, 'office', '--', '--'),
  createHistoryDay(7, 'present', 521, 'office', '09:19 AM', '06:00 PM'),
  createHistoryDay(8, 'leave', 0, 'wfh', '--', '--'),
  createHistoryDay(9, 'present', 515, 'office', '09:25 AM', '06:00 PM'),
  createHistoryDay(10, 'present', 502, 'remote', '09:36 AM', '05:58 PM'),
  createHistoryDay(11, 'absent', 0, 'office', '--', '--'),
  createHistoryDay(12, 'holiday', 0, 'office', '--', '--'),
  createHistoryDay(13, 'present', 510, 'wfh', '09:24 AM', '05:54 PM'),
  createHistoryDay(14, 'late', 486, 'office', '09:51 AM', '05:57 PM'),
  createHistoryDay(15, 'present', 524, 'office', '09:18 AM', '06:02 PM'),
  createHistoryDay(16, 'present', 516, 'remote', '09:28 AM', '06:04 PM'),
  createHistoryDay(17, 'leave', 0, 'wfh', '--', '--'),
  createHistoryDay(18, 'present', 519, 'office', '09:21 AM', '06:00 PM'),
  createHistoryDay(19, 'present', 504, 'office', '09:33 AM', '05:57 PM'),
  createHistoryDay(20, 'early', 454, 'wfh', '09:15 AM', '04:49 PM'),
  createHistoryDay(21, 'present', 522, 'office', '09:20 AM', '06:02 PM'),
];

const metricsSeed: AttendanceMetric[] = [
  { label: 'Attendance rate', trend: 'up', value: '94%' },
  { label: 'Avg start', trend: 'stable', value: '09:27' },
  { label: 'Focus hours', trend: 'up', value: '132h' },
  { label: 'Late arrivals', trend: 'down', value: '2' },
];

const trendsSeed: AttendanceTrendPoint[] = [
  { label: 'Mon', present: 96, target: 90 },
  { label: 'Tue', present: 91, target: 90 },
  { label: 'Wed', present: 88, target: 90 },
  { label: 'Thu', present: 94, target: 90 },
  { label: 'Fri', present: 97, target: 90 },
  { label: 'Sat', present: 20, target: 20 },
];

const workModesSeed: AttendanceWorkModeInsight[] = [
  { days: 14, label: 'Office', mode: 'office', percentage: 70 },
  { days: 4, label: 'WFH', mode: 'wfh', percentage: 20 },
  { days: 2, label: 'Remote', mode: 'remote', percentage: 10 },
];

const insightsSeed: AttendanceInsight[] = [
  {
    body: 'You are trending above the monthly attendance target with strong weekday consistency.',
    id: 'attendance-consistency',
    label: 'Strong consistency',
    tone: 'positive',
  },
  {
    body: 'Two late arrivals were recovered with full-day completion. Keep morning buffer visible.',
    id: 'late-arrival-buffer',
    label: 'Morning buffer',
    tone: 'warning',
  },
  {
    body: 'Office presence is highest on collaboration-heavy days, while remote days keep stable hours.',
    id: 'work-mode-pattern',
    label: 'Mode pattern',
    tone: 'info',
  },
];

const monthSeed: AttendanceMonthSummary = {
  absentDays: 1,
  attendanceRate: 94,
  earlyDepartures: 1,
  lateArrivals: 2,
  leaveDays: 1,
  monthLabel: 'May 2026',
  presentDays: 18,
  readinessScore: 97,
  workHours: 132,
};

const todayPunches = (mode: AttendanceWorkMode): AttendancePunch[] => [
  createPunch('today-clock-in', 'Clock in', '09:26 AM', 'clock-in', mode),
  createPunch('today-break-start', 'Lunch break', '01:08 PM', 'break-start', mode),
  createPunch('today-break-end', 'Back from break', '01:42 PM', 'break-end', mode),
];

const dayDetailFromHistory = (day: AttendanceHistoryDay): AttendanceDayDetail => {
  const isToday = day.date === historySeed[0]?.date;
  const punches = isToday
    ? todayPunches(day.workMode)
    : [
        createPunch(`${day.id}-in`, 'Clock in', day.firstInTime, 'clock-in', day.workMode),
        createPunch(`${day.id}-break-start`, 'Lunch break', '01:04 PM', 'break-start', day.workMode),
        createPunch(`${day.id}-break-end`, 'Back from break', '01:38 PM', 'break-end', day.workMode),
        createPunch(`${day.id}-out`, 'Clock out', day.lastOutTime, 'clock-out', day.workMode),
      ];

  return {
    ...day,
    breakMinutes: day.totalMinutes > 0 ? 34 : 0,
    earlyByMinutes: day.status === 'early' ? 58 : 0,
    lateByMinutes: day.status === 'late' ? 24 : 0,
    location: day.workMode === 'office' ? 'Bengaluru HQ' : 'Verified secure workspace',
    notes:
      day.status === 'late'
        ? 'Traffic delay recorded and workday completed.'
        : 'No exceptions requiring manager review.',
    punches: day.totalMinutes > 0 ? punches : [],
    shiftLabel: 'General shift • 09:30 AM - 06:00 PM',
  };
};

export const createMockAttendanceSnapshot = (
  override?: Partial<AttendanceSnapshot>,
): AttendanceSnapshot => ({
  history: historySeed,
  insights: insightsSeed,
  metrics: metricsSeed,
  month: monthSeed,
  recentPunches: todayPunches(historySeed[0]?.workMode ?? 'office'),
  today: {
    dateLabel: historySeed[0]?.dateLabel ?? 'Today',
    earlyByMinutes: 0,
    firstInTime: '09:26 AM',
    isClockedIn: true,
    isReady: true,
    lastOutTime: '--',
    lateByMinutes: 0,
    shiftLabel: 'General shift • 09:30 AM - 06:00 PM',
    status: 'present',
    statusLabel: 'Clocked in',
    workDurationMinutes: 376,
    workMode: historySeed[0]?.workMode ?? 'office',
  },
  trends: trendsSeed,
  workModes: workModesSeed,
  ...override,
});

export const getMockAttendanceDay = (date?: string): AttendanceDayDetail => {
  const day =
    historySeed.find((item) => item.date === date) ??
    (date ? createHistoryDayForDate(date) : historySeed[0]);

  return dayDetailFromHistory(day);
};

export const applyMockPunch = (
  snapshot: AttendanceSnapshot,
  request: AttendancePunchRequest,
): AttendanceSnapshot => {
  const isClockOut = request.type === 'clock-out';
  const punch = createPunch(
    `local-${request.type}-${Date.now()}`,
    isClockOut ? 'Clock out' : 'Clock in',
    isClockOut ? '06:03 PM' : '09:24 AM',
    request.type,
    request.mode,
  );

  return {
    ...snapshot,
    recentPunches: isClockOut
      ? [...snapshot.recentPunches, punch]
      : [punch, ...snapshot.recentPunches],
    today: {
      ...snapshot.today,
      isClockedIn: !isClockOut,
      lastOutTime: isClockOut ? punch.time : snapshot.today.lastOutTime,
      statusLabel: isClockOut ? 'Day completed' : 'Clocked in',
      workMode: request.mode,
    },
  };
};
