import { isAxiosError } from 'axios';

import { API } from '@/services/api/apiEndpoints';
import { apiClient } from '@/services/api/client/apiClient';
import { mapApiError } from '@/services/api/error-mapping/mapApiError';
import { AppError } from '@/shared/core/errors/AppError';

import type {
  HrmsEnvelopeDto,
  HrmsListEnvelopeDto,
  HrmsSelfServiceSnapshotDto,
} from '../dtos/HrmsSelfServiceDto';

interface HrmsSelfServiceAccess {
  canViewOrganizationEmployees: boolean;
}

const readList = async (endpoint: string): Promise<HrmsListEnvelopeDto> => {
  const response = await apiClient.get<HrmsListEnvelopeDto>(endpoint, {
    params: { limit: 25 },
  });

  return response.data;
};

const isAllowedOptionalFailure = (error: unknown): boolean => {
  if (!isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 403 || error.response?.status === 404;
};

const readOptionalList = async (endpoint: string): Promise<HrmsListEnvelopeDto> => {
  try {
    return await readList(endpoint);
  } catch (error) {
    if (!isAllowedOptionalFailure(error)) {
      throw error;
    }

    return { data: [] };
  }
};

const readOptionalEnvelope = async (endpoint: string): Promise<HrmsEnvelopeDto> => {
  try {
    const response = await apiClient.get<HrmsEnvelopeDto>(endpoint);

    return response.data;
  } catch (error) {
    if (!isAllowedOptionalFailure(error)) {
      throw error;
    }

    return { data: null };
  }
};

export const hrmsSelfServiceApi = {
  async fetchSnapshot(
    access: HrmsSelfServiceAccess,
  ): Promise<HrmsSelfServiceSnapshotDto> {
    try {
      const [
        profileResponse,
        attendanceReadiness,
        documents,
        employees,
        jobDesignations,
        organizationTeams,
        qualifications,
        requests,
      ] = await Promise.all([
        apiClient.get<HrmsEnvelopeDto>(API.hrmsSelfService.profile),
        readOptionalEnvelope(API.hrmsSelfService.attendanceReadiness),
        readOptionalList(API.hrmsSelfService.documents),
        access.canViewOrganizationEmployees
          ? readOptionalList(API.hrmsSelfService.employees)
          : Promise.resolve({ data: [] }),
        access.canViewOrganizationEmployees
          ? readOptionalList(API.hrmsSelfService.jobDesignations)
          : Promise.resolve({ data: [] }),
        access.canViewOrganizationEmployees
          ? readOptionalList(API.hrmsSelfService.organizationTeams)
          : Promise.resolve({ data: [] }),
        readOptionalList(API.hrmsSelfService.qualifications),
        readOptionalList(API.hrmsSelfService.requests),
      ]);

      return {
        attendanceReadiness,
        documents,
        employees,
        jobDesignations,
        organizationTeams,
        profile: profileResponse.data,
        qualifications,
        requests,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw mapApiError(error);
    }
  },
};
