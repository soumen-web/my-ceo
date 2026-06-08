import type { RestoredSession } from '@/modules/auth/domain/entities/AuthSession';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class RestoreSessionUseCase {
  public constructor(private readonly authRepository: AuthRepository) {}

  public execute(): Promise<RestoredSession> {
    return this.authRepository.restoreSession();
  }
}
