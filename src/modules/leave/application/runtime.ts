import { ApplyLeaveUseCase } from '@/modules/leave/application/use-cases/ApplyLeaveUseCase';
import { GetLeaveDetailUseCase } from '@/modules/leave/application/use-cases/GetLeaveDetailUseCase';
import { GetLeaveSnapshotUseCase } from '@/modules/leave/application/use-cases/GetLeaveSnapshotUseCase';
import { LeaveRepositoryImpl } from '@/modules/leave/infrastructure/repositories/LeaveRepositoryImpl';

const leaveRepository = new LeaveRepositoryImpl();

export const leaveUseCases = {
  applyLeave: new ApplyLeaveUseCase(leaveRepository),
  getDetail: new GetLeaveDetailUseCase(leaveRepository),
  getSnapshot: new GetLeaveSnapshotUseCase(leaveRepository),
};
