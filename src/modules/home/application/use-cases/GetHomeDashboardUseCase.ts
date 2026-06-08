import { getHomeDashboardSnapshot } from '@/modules/home/application/getHomeDashboard';
import type { HomeDashboard } from '@/modules/home/domain/entities/HomeDashboard';

export class GetHomeDashboardUseCase {
  public execute(): HomeDashboard {
    return getHomeDashboardSnapshot();
  }
}
