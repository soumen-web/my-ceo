import type {
  AuthSession,
  VerifyOtpCredentials,
} from '@/modules/auth/domain/entities/AuthSession';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class VerifyLoginOtpUseCase {
  public constructor(private readonly authRepository: AuthRepository) {}

  public execute(credentials: VerifyOtpCredentials): Promise<AuthSession> {
    return this.authRepository.verifyOtp(credentials);
  }
}
