import type {
  AttendanceDayDetail,
  AttendancePunchRequest,
  AttendanceSnapshot,
} from '@/modules/attendance/domain/entities/Attendance';
import type {
  AttendanceHistoryQuery,
  AttendanceRepository,
} from '@/modules/attendance/domain/repositories/AttendanceRepository';

import {
  applyMockPunch,
  createMockAttendanceSnapshot,
  getMockAttendanceDay,
} from '../mock/attendanceMockData';

export class AttendanceRepositoryImpl implements AttendanceRepository {
  private snapshot = createMockAttendanceSnapshot();

  public async getAttendanceDay(date: string): Promise<AttendanceDayDetail> {
    return Promise.resolve(getMockAttendanceDay(date));
  }

  public async getAttendanceHistory(
    _query?: AttendanceHistoryQuery,
  ): Promise<AttendanceSnapshot> {
    return Promise.resolve(this.snapshot);
  }

  public async getAttendanceSnapshot(
    _query?: AttendanceHistoryQuery,
  ): Promise<AttendanceSnapshot> {
    return Promise.resolve(this.snapshot);
  }

  public async recordPunch(
    request: AttendancePunchRequest,
  ): Promise<AttendanceSnapshot> {
    this.snapshot = applyMockPunch(this.snapshot, request);

    return Promise.resolve(this.snapshot);
  }

  public async syncAttendance(): Promise<AttendanceSnapshot> {
    this.snapshot = createMockAttendanceSnapshot({
      today: {
        ...this.snapshot.today,
        isReady: true,
        statusLabel: this.snapshot.today.isClockedIn ? 'Clocked in' : 'Synced',
      },
    });

    return Promise.resolve(this.snapshot);
  }
}
