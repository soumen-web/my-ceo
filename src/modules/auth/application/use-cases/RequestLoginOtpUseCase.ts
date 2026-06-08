import type {
  RequestOtpCredentials,
  RequestOtpResult,
} from '@/modules/auth/domain/entities/AuthSession';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class RequestLoginOtpUseCase {
  public constructor(private readonly authRepository: AuthRepository) {}

  public execute(credentials: RequestOtpCredentials): Promise<RequestOtpResult> {
    return this.authRepository.requestOtp(credentials);
  }
}
