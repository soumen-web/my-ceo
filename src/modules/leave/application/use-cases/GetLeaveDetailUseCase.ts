import type { LeaveRepository } from '@/modules/leave/domain/repositories/LeaveRepository';

export class GetLeaveDetailUseCase {
  public constructor(private readonly repository: LeaveRepository) {}

  public execute(id: string) {
    return this.repository.getLeaveDetail(id);
  }
}
