import type { HrmsSelfServiceSnapshot } from '@/modules/hrms/domain/entities/HrmsSelfService';
import type {
  HrmsSelfServiceAccess,
  HrmsSelfServiceRepository,
} from '@/modules/hrms/domain/repositories/HrmsSelfServiceRepository';

import { hrmsSelfServiceApi } from '../api/hrmsSelfServiceApi';
import { hrmsSelfServiceMapper } from '../mappers/hrmsSelfServiceMapper';

export class HrmsSelfServiceRepositoryImpl implements HrmsSelfServiceRepository {
  public async getSelfServiceSnapshot(
    access: HrmsSelfServiceAccess,
  ): Promise<HrmsSelfServiceSnapshot> {
    const response = await hrmsSelfServiceApi.fetchSnapshot(access);

    return hrmsSelfServiceMapper.toDomain(response);
  }
}
