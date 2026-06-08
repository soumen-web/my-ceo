import type { HrQuery } from '@/modules/hr-query/domain/entities/HrQuery';
import type { HrQueryRepository } from '@/modules/hr-query/domain/repositories/HrQueryRepository';

export class GetHrQueryByIdUseCase {
  public constructor(private readonly repository: HrQueryRepository) {}

  public execute(id: string): Promise<HrQuery | null> {
    return this.repository.getQueryById(id);
  }
}
