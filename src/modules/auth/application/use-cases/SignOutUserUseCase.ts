import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class SignOutUserUseCase {
  public constructor(private readonly authRepository: AuthRepository) {}

  public execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}
