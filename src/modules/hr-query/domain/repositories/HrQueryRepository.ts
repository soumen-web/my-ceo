import type {
  CreateHrQueryRequest,
  HrQuery,
  HrQuerySnapshot,
} from '../entities/HrQuery';

export interface HrQueryRepository {
  createQuery(request: CreateHrQueryRequest): Promise<HrQuerySnapshot>;
  getQueryById(id: string): Promise<HrQuery | null>;
  getQueries(): Promise<HrQuerySnapshot>;
}
