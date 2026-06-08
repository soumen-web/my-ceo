import type { ApplyLeaveRequest } from '@/modules/leave/domain/entities/Leave';
import type { LeaveRepository } from '@/modules/leave/domain/repositories/LeaveRepository';

export class ApplyLeaveUseCase {
  public constructor(private readonly repository: LeaveRepository) {}

  public execute(request: ApplyLeaveRequest) {
    return this.repository.applyLeave(request);
  }
}
