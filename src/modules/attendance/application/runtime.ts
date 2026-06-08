import { GetAttendanceDayUseCase } from '@/modules/attendance/application/use-cases/GetAttendanceDayUseCase';
import { GetAttendanceHistoryUseCase } from '@/modules/attendance/application/use-cases/GetAttendanceHistoryUseCase';
import { GetAttendanceSnapshotUseCase } from '@/modules/attendance/application/use-cases/GetAttendanceSnapshotUseCase';
import { RecordAttendancePunchUseCase } from '@/modules/attendance/application/use-cases/RecordAttendancePunchUseCase';
import { SyncAttendanceUseCase } from '@/modules/attendance/application/use-cases/SyncAttendanceUseCase';
import { AttendanceRepositoryImpl } from '@/modules/attendance/infrastructure/repositories/AttendanceRepositoryImpl';

const attendanceRepository = new AttendanceRepositoryImpl();

export const attendanceUseCases = {
  getDay: new GetAttendanceDayUseCase(attendanceRepository),
  getHistory: new GetAttendanceHistoryUseCase(attendanceRepository),
  getSnapshot: new GetAttendanceSnapshotUseCase(attendanceRepository),
  recordPunch: new RecordAttendancePunchUseCase(attendanceRepository),
  sync: new SyncAttendanceUseCase(attendanceRepository),
};
