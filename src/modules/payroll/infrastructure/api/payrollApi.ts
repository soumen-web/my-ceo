import { API } from '@/services/api/apiEndpoints';
import { apiClient } from '@/services/api/client/apiClient';
import { mapApiError } from '@/services/api/error-mapping/mapApiError';

import type { PayrollCycleDto, PayrollSnapshotDto } from '../dtos/PayrollDto';

export const payrollApi = {
  async fetchCycle(cycleId: string): Promise<PayrollCycleDto> {
    try {
      const response = await apiClient.get<PayrollCycleDto>(API.payroll.cycle(cycleId));

      return response.data;
    } catch (error) {
      throw mapApiError(error);
    }
  },
  async fetchSnapshot(): Promise<PayrollSnapshotDto> {
    try {
      const response = await apiClient.get<PayrollSnapshotDto>(API.payroll.snapshot);

      return response.data;
    } catch (error) {
      throw mapApiError(error);
    }
  },
};
