import type {
  AppCapability,
  AppRole,
} from '@/shared/types/access';

export interface AuthenticatedUser {
  capabilities: AppCapability[];
  email: string;
  firstName?: string;
  id: string;
  lastName?: string;
  profileImage?: string;
  roles: AppRole[];
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  user: AuthenticatedUser;
}

export interface RestoredSession {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface RequestOtpCredentials {
  email: string;
}

export interface RequestOtpResult {
  email: string;
  message?: string;
  otp?: string;
}

export interface VerifyOtpCredentials {
  email: string;
  otp: string;
}
