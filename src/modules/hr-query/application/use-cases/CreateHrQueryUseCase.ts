import type {
  CreateHrQueryRequest,
  HrQuerySnapshot,
} from '@/modules/hr-query/domain/entities/HrQuery';
import type { HrQueryRepository } from '@/modules/hr-query/domain/repositories/HrQueryRepository';

export class CreateHrQueryUseCase {
  public constructor(private readonly repository: HrQueryRepository) {}

  public execute(request: CreateHrQueryRequest): Promise<HrQuerySnapshot> {
    return this.repository.createQuery(request);
  }
}
