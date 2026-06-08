import type { HrQuerySnapshot } from '@/modules/hr-query/domain/entities/HrQuery';
import type { HrQueryRepository } from '@/modules/hr-query/domain/repositories/HrQueryRepository';

export class GetHrQueriesUseCase {
  public constructor(private readonly repository: HrQueryRepository) {}

  public execute(): Promise<HrQuerySnapshot> {
    return this.repository.getQueries();
  }
}
