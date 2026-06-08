import type { AttendancePunchRequest } from '@/modules/attendance/domain/entities/Attendance';
import type { AttendanceRepository } from '@/modules/attendance/domain/repositories/AttendanceRepository';

export class RecordAttendancePunchUseCase {
  public constructor(private readonly repository: AttendanceRepository) {}

  public execute(request: AttendancePunchRequest) {
    return this.repository.recordPunch(request);
  }
}
