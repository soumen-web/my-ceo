export type AuthOtpPlatformDto = 'mobile' | 'desktop';

export interface RequestOtpApiRequestDto {
  email: string;
  platform: AuthOtpPlatformDto;
}

export interface RequestOtpApiResponseDto {
  correlationId?: string;
  data?: {
    challengeId?: string;
    email?: string;
    expiresAt?: string;
    message?: string;
    otp?: string;
    platform?: string;
  };
  message?: string;
  success?: boolean;
  statusCode?: number;
  timestamp?: string;
}

export interface VerifyOtpApiRequestDto {
  email: string;
  otp: string;
  platform: AuthOtpPlatformDto;
}
