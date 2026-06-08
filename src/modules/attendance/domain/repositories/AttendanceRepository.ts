import type {
  AttendanceDayDetail,
  AttendancePunchRequest,
  AttendanceSnapshot,
} from '@/modules/attendance/domain/entities/Attendance';

export interface AttendanceHistoryQuery {
  month?: string;
  page?: number;
}

export interface AttendanceRepository {
  getAttendanceDay(date: string): Promise<AttendanceDayDetail>;
  getAttendanceHistory(query?: AttendanceHistoryQuery): Promise<AttendanceSnapshot>;
  getAttendanceSnapshot(query?: AttendanceHistoryQuery): Promise<AttendanceSnapshot>;
  recordPunch(request: AttendancePunchRequest): Promise<AttendanceSnapshot>;
  syncAttendance(): Promise<AttendanceSnapshot>;
}
