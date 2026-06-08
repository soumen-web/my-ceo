import type { LeaveRepository } from '@/modules/leave/domain/repositories/LeaveRepository';

export class GetLeaveSnapshotUseCase {
  public constructor(private readonly repository: LeaveRepository) {}

  public execute() {
    return this.repository.getLeaveSnapshot();
  }
}
