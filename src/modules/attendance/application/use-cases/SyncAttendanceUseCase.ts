import type { AttendanceRepository } from '@/modules/attendance/domain/repositories/AttendanceRepository';

export class SyncAttendanceUseCase {
  public constructor(private readonly repository: AttendanceRepository) {}

  public execute() {
    return this.repository.syncAttendance();
  }
}
