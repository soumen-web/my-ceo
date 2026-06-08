import type {
  AuthSession,
  RequestOtpCredentials,
  RequestOtpResult,
  RestoredSession,
  SignInCredentials,
  VerifyOtpCredentials,
} from '@/modules/auth/domain/entities/AuthSession';

export interface AuthRepository {
  deleteAccount(): Promise<void>;
  requestOtp(credentials: RequestOtpCredentials): Promise<RequestOtpResult>;
  restoreSession(): Promise<RestoredSession>;
  signIn(credentials: SignInCredentials): Promise<AuthSession>;
  signOut(): Promise<void>;
  verifyOtp(credentials: VerifyOtpCredentials): Promise<AuthSession>;
}
