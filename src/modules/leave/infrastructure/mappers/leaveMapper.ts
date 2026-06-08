import type {
  ApplyLeaveRequest,
  LeaveSnapshot,
} from '@/modules/leave/domain/entities/Leave';

import type { ApplyLeaveRequestDto, LeaveEnvelopeDto } from '../dtos/LeaveDto';

export const mapApplyLeaveToDto = (
  request: ApplyLeaveRequest,
): ApplyLeaveRequestDto => ({
  dayPart: request.dayPart,
  endDate: request.endDate,
  endDateType: request.endDateType,
  reason: request.reason,
  selectedDates: request.selectedDates,
  startDate: request.startDate,
  startDateType: request.startDateType,
  totalDays: request.totalDays,
  type: request.type,
});

export const mapLeaveEnvelopeToSnapshot = (
  envelope: LeaveEnvelopeDto<LeaveSnapshot>,
): LeaveSnapshot => {
  if (!envelope.data) {
    throw new Error('Leave snapshot response did not include data.');
  }

  return envelope.data;
};
