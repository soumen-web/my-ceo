import type {
  AttendanceHistoryQuery,
  AttendanceRepository,
} from '@/modules/attendance/domain/repositories/AttendanceRepository';

export class GetAttendanceHistoryUseCase {
  public constructor(private readonly repository: AttendanceRepository) {}

  public execute(query?: AttendanceHistoryQuery) {
    return this.repository.getAttendanceHistory(query);
  }
}
