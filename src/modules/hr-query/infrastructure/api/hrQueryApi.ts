import { API } from '@/services/api/apiEndpoints';
import { apiClient } from '@/services/api/client/apiClient';
import { mapApiError } from '@/services/api/error-mapping/mapApiError';
import { logger } from '@/services/observability/logger/logger';

import type {
  CreateHrQueryRequestDto,
  HrQueryDto,
  HrQuerySnapshotDto,
} from '../dtos/HrQueryDto';

export const hrQueryApi = {
  async createQuery(request: CreateHrQueryRequestDto): Promise<HrQueryDto> {
    try {
      console.log('[DEBUG][HR Query Create Payload]', {
        endpoint: API.hrQuery.requests,
        payload: request,
      });
      const response = await apiClient.post<HrQueryDto>(
        API.hrQuery.requests,
        request,
      );

      logger.info('HR query create response', {
        endpoint: API.hrQuery.requests,
        response: response.data,
      });
      console.log('[DEBUG][HR Query Create Response]', {
        endpoint: API.hrQuery.requests,
        response: response.data,
      });

      return response.data;
    } catch (error) {
      console.log('[DEBUG][HR Query Create Error]', {
        endpoint: API.hrQuery.requests,
        message: error instanceof Error ? error.message : 'Unable to submit HR query',
      });
      throw mapApiError(error);
    }
  },
  async fetchQueryById(id: string): Promise<HrQueryDto> {
    try {
      console.log('[DEBUG][HR Query Detail Payload]', {
        endpoint: API.hrQuery.requestById(id),
        id,
      });
      const response = await apiClient.get<HrQueryDto>(API.hrQuery.requestById(id));

      logger.info('HR query detail response', {
        endpoint: API.hrQuery.requestById(id),
        response: response.data,
      });
      console.log('[DEBUG][HR Query Detail Response]', {
        endpoint: API.hrQuery.requestById(id),
        response: response.data,
      });

      return response.data;
    } catch (error) {
      console.log('[DEBUG][HR Query Detail Error]', {
        endpoint: API.hrQuery.requestById(id),
        message: error instanceof Error ? error.message : 'Unable to load HR query detail',
      });
      throw mapApiError(error);
    }
  },
  async fetchQueries(): Promise<HrQuerySnapshotDto> {
    try {
      console.log('[DEBUG][HR Query Track Payload]', {
        endpoint: API.hrQuery.requests,
        params: { limit: 50 },
      });
      const response = await apiClient.get<HrQuerySnapshotDto>(API.hrQuery.requests, {
        params: { limit: 50 },
      });

      logger.info('HR query track response', {
        endpoint: API.hrQuery.requests,
        limit: 50,
        response: response.data,
      });
      console.log('[DEBUG][HR Query Track Response]', {
        endpoint: API.hrQuery.requests,
        limit: 50,
        response: response.data,
      });

      return response.data;
    } catch (error) {
      console.log('[DEBUG][HR Query Track Error]', {
        endpoint: API.hrQuery.requests,
        message: error instanceof Error ? error.message : 'Unable to load HR queries',
      });
      throw mapApiError(error);
    }
  },
};
