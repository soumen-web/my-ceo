import type {
  CreateHrQueryRequest,
  HrQuery,
  HrQuerySnapshot,
} from '@/modules/hr-query/domain/entities/HrQuery';
import type { HrQueryRepository } from '@/modules/hr-query/domain/repositories/HrQueryRepository';

import { hrQueryApi } from '../api/hrQueryApi';
import { hrQueryMapper } from '../mappers/hrQueryMapper';

export class HrQueryRepositoryImpl implements HrQueryRepository {
  public async createQuery(request: CreateHrQueryRequest): Promise<HrQuerySnapshot> {
    await hrQueryApi.createQuery(hrQueryMapper.createRequestToDto(request));

    return this.getQueries();
  }

  public async getQueryById(id: string): Promise<HrQuery | null> {
    const response = await hrQueryApi.fetchQueryById(id);

    return hrQueryMapper.queryToDomain(response);
  }

  public async getQueries(): Promise<HrQuerySnapshot> {
    const response = await hrQueryApi.fetchQueries();

    return hrQueryMapper.snapshotToDomain(response);
  }
}
