import type { HrmsSelfServiceSnapshot } from '@/modules/hrms/domain/entities/HrmsSelfService';
import type {
  HrmsSelfServiceAccess,
  HrmsSelfServiceRepository,
} from '@/modules/hrms/domain/repositories/HrmsSelfServiceRepository';

export class GetHrmsSelfServiceSnapshotUseCase {
  public constructor(private readonly repository: HrmsSelfServiceRepository) {}

  public execute(access: HrmsSelfServiceAccess): Promise<HrmsSelfServiceSnapshot> {
    return this.repository.getSelfServiceSnapshot(access);
  }
}
