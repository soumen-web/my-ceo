import { API } from '@/services/api/apiEndpoints';
import { apiClient } from '@/services/api/client/apiClient';
import { mapApiError } from '@/services/api/error-mapping/mapApiError';
import { AppError } from '@/shared/core/errors/AppError';

import type {
  AttendanceDayDetailDto,
  AttendancePunchRequestDto,
  AttendanceSnapshotDto,
} from '../dtos/AttendanceDto';

interface AttendanceHistoryParams {
  month?: string;
  page?: number;
}

const request = async <TResponse>(
  runner: () => Promise<{ data: TResponse }>,
): Promise<TResponse> => {
  try {
    const response = await runner();

    return response.data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw mapApiError(error);
  }
};

export const attendanceApi = {
  fetchDay(date: string): Promise<AttendanceDayDetailDto> {
    return request(() => apiClient.get<AttendanceDayDetailDto>(API.attendance.day(date)));
  },
  fetchHistory(params?: AttendanceHistoryParams): Promise<AttendanceSnapshotDto> {
    return request(() =>
      apiClient.get<AttendanceSnapshotDto>(API.attendance.history, { params }),
    );
  },
  fetchSnapshot(params?: AttendanceHistoryParams): Promise<AttendanceSnapshotDto> {
    return request(() =>
      apiClient.get<AttendanceSnapshotDto>(API.attendance.snapshot, { params }),
    );
  },
  recordPunch(payload: AttendancePunchRequestDto): Promise<AttendanceSnapshotDto> {
    return request(() =>
      apiClient.post<AttendanceSnapshotDto>(API.attendance.punch, payload),
    );
  },
  sync(): Promise<AttendanceSnapshotDto> {
    return request(() => apiClient.post<AttendanceSnapshotDto>(API.attendance.sync));
  },
};
