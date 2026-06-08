import type { AttendanceRepository } from '@/modules/attendance/domain/repositories/AttendanceRepository';

export class GetAttendanceDayUseCase {
  public constructor(private readonly repository: AttendanceRepository) {}

  public execute(date: string) {
    return this.repository.getAttendanceDay(date);
  }
}
