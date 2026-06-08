import { API } from '@/services/api/apiEndpoints';
import { apiClient } from '@/services/api/client/apiClient';
import { mapApiError } from '@/services/api/error-mapping/mapApiError';

import type { LeaveSnapshot } from '../../domain/entities/Leave';
import type { ApplyLeaveRequestDto, LeaveEnvelopeDto } from '../dtos/LeaveDto';

export const leaveApi = {
  async applyLeave(request: ApplyLeaveRequestDto): Promise<LeaveEnvelopeDto<LeaveSnapshot>> {
    try {
      const response = await apiClient.post<LeaveEnvelopeDto<LeaveSnapshot>>(
        API.leave.apply,
        request,
      );

      return response.data;
    } catch (error) {
      throw mapApiError(error);
    }
  },
  async fetchLeaveDetail(leaveId: string): Promise<LeaveEnvelopeDto> {
    try {
      const response = await apiClient.get<LeaveEnvelopeDto>(API.leave.detail(leaveId));

      return response.data;
    } catch (error) {
      throw mapApiError(error);
    }
  },
  async fetchSnapshot(): Promise<LeaveEnvelopeDto<LeaveSnapshot>> {
    try {
      const response = await apiClient.get<LeaveEnvelopeDto<LeaveSnapshot>>(
        API.leave.snapshot,
      );

      return response.data;
    } catch (error) {
      throw mapApiError(error);
    }
  },
};
