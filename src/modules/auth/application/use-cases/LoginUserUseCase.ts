import type {
  AuthSession,
  SignInCredentials,
} from '@/modules/auth/domain/entities/AuthSession';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class LoginUserUseCase {
  public constructor(private readonly authRepository: AuthRepository) {}

  public execute(credentials: SignInCredentials): Promise<AuthSession> {
    return this.authRepository.signIn(credentials);
  }
}
