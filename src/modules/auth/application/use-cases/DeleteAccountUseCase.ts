import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class DeleteAccountUseCase {
  public constructor(private readonly authRepository: AuthRepository) {}

  public execute(): Promise<void> {
    return this.authRepository.deleteAccount();
  }
}
