import type {
  ApplyLeaveRequest,
  LeaveRequest,
  LeaveSnapshot,
} from '@/modules/leave/domain/entities/Leave';

export interface LeaveRepository {
  applyLeave(request: ApplyLeaveRequest): Promise<LeaveSnapshot>;
  getLeaveDetail(id: string): Promise<LeaveRequest | null>;
  getLeaveSnapshot(): Promise<LeaveSnapshot>;
}
