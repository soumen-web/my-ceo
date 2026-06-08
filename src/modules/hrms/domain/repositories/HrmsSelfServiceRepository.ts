import type { HrmsSelfServiceSnapshot } from '../entities/HrmsSelfService';

export interface HrmsSelfServiceAccess {
  canViewOrganizationEmployees: boolean;
}

export interface HrmsSelfServiceRepository {
  getSelfServiceSnapshot(access: HrmsSelfServiceAccess): Promise<HrmsSelfServiceSnapshot>;
}
