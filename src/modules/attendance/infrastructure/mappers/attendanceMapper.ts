import type {
  AttendanceDayDetail,
  AttendanceDayStatus,
  AttendanceHistoryDay,
  AttendanceInsight,
  AttendanceMetric,
  AttendanceMonthSummary,
  AttendancePunch,
  AttendancePunchRequest,
  AttendancePunchType,
  AttendanceSnapshot,
  AttendanceTrendDirection,
  AttendanceTrendPoint,
  AttendanceWorkMode,
  AttendanceWorkModeInsight,
} from '@/modules/attendance/domain/entities/Attendance';
import { createEmptyAttendanceSnapshot } from '@/modules/attendance/domain/entities/Attendance';

import type {
  AttendanceDayDetailDto,
  AttendancePunchRequestDto,
  AttendanceRecordDto,
  AttendanceSnapshotDto,
} from '../dtos/AttendanceDto';

const asRecord = (value: unknown): AttendanceRecordDto =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as AttendanceRecordDto)
    : {};

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const asBoolean = (value: unknown): boolean => value === true;

const asArray = (value: unknown): AttendanceRecordDto[] =>
  Array.isArray(value) ? value.map(asRecord) : [];

const humanize = (value: unknown, fallback = 'Not available'): string => {
  const rawValue = asString(value, fallback);

  return rawValue
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
};

const formatDate = (value: unknown, fallback = 'Today'): string => {
  const rawValue = asString(value, '');

  if (!rawValue) {
    return fallback;
  }

  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    return rawValue;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatWeekday = (value: unknown): string => {
  const rawValue = asString(value, '');
  const date = rawValue ? new Date(rawValue) : new Date();

  if (Number.isNaN(date.getTime())) {
    return 'Day';
  }

  return new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date);
};

const formatTime = (value: unknown): string => {
  const rawValue = asString(value, '');

  if (!rawValue) {
    return '--';
  }

  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    return rawValue;
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const normalizeStatus = (value: unknown): AttendanceDayStatus => {
  const normalized = asString(value, '').toLowerCase();

  if (normalized.includes('week')) return 'weekend';
  if (normalized.includes('holiday')) return 'holiday';
  if (normalized.includes('leave')) return 'leave';
  if (normalized.includes('absent')) return 'absent';
  if (normalized.includes('early')) return 'early';
  if (normalized.includes('late')) return 'late';
  if (normalized.includes('present') || normalized.includes('clock')) return 'present';

  return 'absent';
};

const normalizeMode = (value: unknown): AttendanceWorkMode => {
  const normalized = asString(value, '').toLowerCase();

  if (normalized.includes('remote')) return 'remote';
  if (normalized.includes('home') || normalized.includes('wfh')) return 'wfh';

  return 'office';
};

const normalizePunchType = (value: unknown): AttendancePunchType => {
  const normalized = asString(value, '').toLowerCase();

  if (normalized.includes('break') && normalized.includes('end')) return 'break-end';
  if (normalized.includes('break')) return 'break-start';
  if (normalized.includes('out')) return 'clock-out';

  return 'clock-in';
};

const normalizeTrend = (value: unknown): AttendanceTrendDirection => {
  const normalized = asString(value, '').toLowerCase();

  if (normalized.includes('down')) return 'down';
  if (normalized.includes('up')) return 'up';

  return 'stable';
};

const rootData = (dto: AttendanceSnapshotDto | AttendanceDayDetailDto): AttendanceRecordDto =>
  asRecord(dto.data);

const listFrom = (record: AttendanceRecordDto, keys: string[]): AttendanceRecordDto[] => {
  for (const key of keys) {
    const value = record[key];
    const directList = asArray(value);

    if (directList.length) {
      return directList;
    }

    const nestedItems = asArray(asRecord(value).items);

    if (nestedItems.length) {
      return nestedItems;
    }
  }

  return [];
};

const mapPunch = (record: AttendanceRecordDto, index: number): AttendancePunch => {
  const punchType = normalizePunchType(record.type ?? record.punchType ?? record.eventType);

  return {
    id: asString(record.id, `punch-${index}`),
    label: humanize(record.label ?? record.type ?? record.punchType, punchType),
    location: asString(record.locationName ?? record.location ?? record.deviceName, 'Workspace'),
    mode: normalizeMode(record.mode ?? record.workMode),
    time: formatTime(record.time ?? record.punchTime ?? record.createdAt),
    type: punchType,
  };
};

const mapHistoryDay = (record: AttendanceRecordDto, index: number): AttendanceHistoryDay => {
  const status = normalizeStatus(record.status ?? record.attendanceStatus);
  const date = asString(record.date ?? record.attendanceDate, new Date().toISOString());

  return {
    date,
    dateLabel: formatDate(date),
    dayLabel: formatWeekday(date),
    firstInTime: formatTime(record.firstIn ?? record.clockInTime ?? record.firstPunchAt),
    id: asString(record.id, `attendance-day-${index}`),
    lastOutTime: formatTime(record.lastOut ?? record.clockOutTime ?? record.lastPunchAt),
    status,
    statusLabel: humanize(record.statusLabel ?? record.status ?? record.attendanceStatus, 'Not started'),
    totalMinutes: asNumber(record.totalMinutes ?? record.workDurationMinutes ?? record.durationMinutes),
    workMode: normalizeMode(record.mode ?? record.workMode),
  };
};

const mapDayDetail = (record: AttendanceRecordDto): AttendanceDayDetail => {
  const day = mapHistoryDay(record, 0);
  const punches = listFrom(record, ['punches', 'timeline', 'events']).map(mapPunch);

  return {
    ...day,
    breakMinutes: asNumber(record.breakMinutes ?? record.totalBreakMinutes),
    earlyByMinutes: asNumber(record.earlyByMinutes ?? record.earlyMinutes),
    lateByMinutes: asNumber(record.lateByMinutes ?? record.lateMinutes),
    location: asString(record.locationName ?? record.location, 'Workspace'),
    notes: asString(record.notes ?? record.note, 'No notes added.'),
    punches,
    shiftLabel: asString(record.shiftLabel ?? record.shiftName, 'General shift'),
  };
};

const mapToday = (record: AttendanceRecordDto): AttendanceSnapshot['today'] => {
  const status = normalizeStatus(record.status ?? record.attendanceStatus);

  return {
    dateLabel: formatDate(record.date ?? record.attendanceDate, 'Today'),
    earlyByMinutes: asNumber(record.earlyByMinutes ?? record.earlyMinutes),
    firstInTime: formatTime(record.firstIn ?? record.clockInTime ?? record.firstPunchAt),
    isClockedIn: asBoolean(record.isClockedIn ?? record.clockedIn),
    isReady: asBoolean(record.isReady ?? record.ready ?? record.readiness),
    lastOutTime: formatTime(record.lastOut ?? record.clockOutTime ?? record.lastPunchAt),
    lateByMinutes: asNumber(record.lateByMinutes ?? record.lateMinutes),
    shiftLabel: asString(record.shiftLabel ?? record.shiftName, 'General shift'),
    status,
    statusLabel: humanize(record.statusLabel ?? record.status ?? record.attendanceStatus, 'Not started'),
    workDurationMinutes: asNumber(
      record.workDurationMinutes ?? record.totalMinutes ?? record.durationMinutes,
    ),
    workMode: normalizeMode(record.mode ?? record.workMode),
  };
};

const mapMonth = (record: AttendanceRecordDto): AttendanceMonthSummary => ({
  absentDays: asNumber(record.absentDays ?? record.absent),
  attendanceRate: asNumber(record.attendanceRate ?? record.presentPercentage),
  earlyDepartures: asNumber(record.earlyDepartures ?? record.earlyDays),
  lateArrivals: asNumber(record.lateArrivals ?? record.lateDays),
  leaveDays: asNumber(record.leaveDays ?? record.leaves),
  monthLabel: asString(record.monthLabel ?? record.month, 'This month'),
  presentDays: asNumber(record.presentDays ?? record.present),
  readinessScore: asNumber(record.readinessScore ?? record.readiness ?? record.score),
  workHours: asNumber(record.workHours ?? record.totalWorkHours),
});

const mapMetric = (record: AttendanceRecordDto, index: number): AttendanceMetric => ({
  label: asString(record.label ?? record.name, `Metric ${index + 1}`),
  trend: normalizeTrend(record.trend ?? record.direction),
  value: asString(record.value ?? record.total, '0'),
});

const mapTrend = (record: AttendanceRecordDto, index: number): AttendanceTrendPoint => ({
  label: asString(record.label ?? record.day ?? record.week, `W${index + 1}`),
  present: asNumber(record.present ?? record.value),
  target: asNumber(record.target ?? record.expected, 100),
});

const mapWorkModeInsight = (
  record: AttendanceRecordDto,
  index: number,
): AttendanceWorkModeInsight => {
  const mode = normalizeMode(record.mode ?? record.workMode ?? record.label);

  return {
    days: asNumber(record.days ?? record.count),
    label: asString(record.label, humanize(mode)),
    mode,
    percentage: asNumber(record.percentage ?? record.percent),
  };
};

const mapInsight = (record: AttendanceRecordDto, index: number): AttendanceInsight => ({
  body: asString(record.body ?? record.message ?? record.description, 'Attendance insight is ready.'),
  id: asString(record.id, `attendance-insight-${index}`),
  label: asString(record.label ?? record.title, 'Insight'),
  tone: asString(record.tone, 'info') as AttendanceInsight['tone'],
});

const createDefaultMetrics = (month: AttendanceMonthSummary): AttendanceMetric[] => [
  {
    label: 'Attendance rate',
    trend: month.attendanceRate >= 95 ? 'up' : month.attendanceRate >= 85 ? 'stable' : 'down',
    value: `${Math.round(month.attendanceRate)}%`,
  },
  {
    label: 'Present days',
    trend: 'stable',
    value: `${month.presentDays}`,
  },
  {
    label: 'Work hours',
    trend: 'up',
    value: `${Math.round(month.workHours)}h`,
  },
];

export const attendanceMapper = {
  toDayDetail(dto: AttendanceDayDetailDto): AttendanceDayDetail {
    return mapDayDetail(rootData(dto));
  },
  toPunchRequestDto(request: AttendancePunchRequest): AttendancePunchRequestDto {
    return {
      mode: request.mode,
      note: request.note,
      punchType: request.type === 'clock-out' ? 'CLOCK_OUT' : 'CLOCK_IN',
    };
  },
  toSnapshot(dto: AttendanceSnapshotDto): AttendanceSnapshot {
    const emptySnapshot = createEmptyAttendanceSnapshot();
    const data = rootData(dto);
    const today = mapToday(asRecord(data.today ?? data.dailyStatus ?? data.currentDay));
    const month = mapMonth(asRecord(data.month ?? data.monthSummary ?? data.analytics));
    const history = listFrom(data, ['history', 'records', 'attendance']).map(mapHistoryDay);
    const recentPunches = listFrom(data, ['recentPunches', 'punches', 'timeline']).map(mapPunch);
    const metrics = listFrom(data, ['metrics', 'summaries']).map(mapMetric);
    const trends = listFrom(data, ['trends', 'weeklyTrend', 'monthlyTrend']).map(mapTrend);
    const workModes = listFrom(data, ['workModes', 'workModeInsights']).map(mapWorkModeInsight);
    const insights = listFrom(data, ['insights', 'recommendations']).map(mapInsight);

    return {
      ...emptySnapshot,
      history,
      insights,
      metrics: metrics.length ? metrics : createDefaultMetrics(month),
      month,
      recentPunches,
      today,
      trends,
      workModes,
    };
  },
};
