import type {
  ApplyLeaveRequest,
  LeaveRequest,
  LeaveSnapshot,
} from '@/modules/leave/domain/entities/Leave';
import type { LeaveRepository } from '@/modules/leave/domain/repositories/LeaveRepository';

import {
  applyMockLeaveRequest,
  createMockLeaveSnapshot,
} from '../mock/leaveMockData';

export class LeaveRepositoryImpl implements LeaveRepository {
  private snapshot = createMockLeaveSnapshot();

  public async applyLeave(request: ApplyLeaveRequest): Promise<LeaveSnapshot> {
    this.snapshot = applyMockLeaveRequest(this.snapshot, request);

    return Promise.resolve(this.snapshot);
  }

  public async getLeaveDetail(id: string): Promise<LeaveRequest | null> {
    return Promise.resolve(
      this.snapshot.history.find((leave) => leave.id === id) ?? null,
    );
  }

  public async getLeaveSnapshot(): Promise<LeaveSnapshot> {
    return Promise.resolve(this.snapshot);
  }
}
